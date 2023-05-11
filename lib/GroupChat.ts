import {
  Ciphertext,
  Client,
  Conversation,
  DecodedMessage,
  PublicKeyBundle,
  decrypt,
  encrypt,
} from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
import { hexToBytes, bytesToHex } from "./util";
import {
  GroupChatInviteCodec,
  GroupChatInvite,
  ContentTypeGroupChatInvite,
} from "./GroupChatInviteCodec";
import * as secp from "@noble/secp256k1";
import {
  ContentTypeGroupChatMemberAdded,
  GroupChatMemberAdded,
  GroupChatMemberAddedCodec,
} from "./GroupChatMemberAddedCodec";
import {
  ContentTypeGroupChatMemberRemoved,
  GroupChatMemberRemoved,
  GroupChatMemberRemovedCodec,
} from "./GroupChatMemberRemovedCodec";

export class GroupChat {
  address: string;
  sharedKeys: string[] = [];
  sharedClients: Client[] = [];
  _members: string[] = [];

  get members(): string[] {
    return Array.from(new Set(this._members));
  }

  set members(members: string[]) {
    this._members = Array.from(new Set(members));
  }

  async sharedWallet(): Promise<string> {
    const bundle = await this.sharedClient.keystore.getPrivateKeyBundle();
    const key = bundle.identityKey?.secp256k1?.bytes;

    if (!key) {
      throw new Error("No key found");
    }

    return "0x" + bytesToHex(key);
  }

  get sharedKey(): string {
    const key = this.sharedKeys[this.sharedKeys.length - 1];

    if (key) {
      return key;
    }

    throw new Error("No shared key found");
  }

  get sharedClient(): Client {
    const client = this.sharedClients[this.sharedClients.length - 1];

    if (client) {
      return client;
    }

    throw new Error("No shared client found");
  }

  constructor(address: string) {
    this.address = address;
  }

  // List conversations with awareness of group chats
  static async listConversations(client: Client): Promise<Conversation[]> {
    const conversations = await client.conversations.list();
    const groupChatsByAddress: { [address: string]: GroupChat } = {};
    const result: Conversation[] = [];

    for (const conversation of conversations) {
      if (conversation.context?.metadata?.type === "group-chat") {
        const existingGroupChat =
          groupChatsByAddress[conversation.context?.metadata?.address];

        if (!existingGroupChat) {
          const groupChat = await GroupChat.fromConversation(
            client,
            conversation,
          );

          groupChatsByAddress[conversation.context?.metadata?.address] =
            groupChat;

          result.push(conversation);
        } else {
          console.log("ADDING ANOTHER CONVERSATION");
          await existingGroupChat.addConversation(client, conversation);
        }
      } else {
        result.push(conversation);
      }
    }

    return result;
  }

  static async fromConversation(
    client: Client,
    conversation: Conversation,
  ): Promise<GroupChat> {
    const address = conversation.context?.metadata?.address;

    if (!address) {
      throw new Error("No address found");
    }

    const groupChat = new GroupChat(address);
    await groupChat.addConversation(client, conversation);

    return groupChat;
  }

  async addConversation(client: Client, conversation: Conversation) {
    if (conversation.context?.metadata?.type !== "group-chat") {
      throw new Error("Conversation is not a group chat");
    }

    const messages = await conversation.messages();

    const groupChatInvite = messages.find((message) => {
      return message.contentType.sameAs(ContentTypeGroupChatInvite);
    })?.content as GroupChatInvite;

    if (!groupChatInvite) {
      throw new Error("No group chat invite found");
    }

    const senderPublicKeyBundle = PublicKeyBundle.fromBytes(
      hexToBytes(groupChatInvite.sender),
    ).identityKey.secp256k1Uncompressed.bytes;
    const keyBundle = await client.keystore.getPrivateKeyBundle();
    const keyBundlePrivateKey = keyBundle.identityKey?.secp256k1?.bytes;

    if (!keyBundlePrivateKey) {
      throw new Error("No key bundle private key found");
    }

    const sharedSecret = secp.getSharedSecret(
      keyBundlePrivateKey,
      senderPublicKeyBundle,
      false,
    );

    const sharedWallet = new Wallet(
      await decrypt(
        Ciphertext.fromBytes(hexToBytes(groupChatInvite.encryptedSharedWallet)),
        sharedSecret,
      ),
    );

    const sharedClient = await Client.create(sharedWallet);

    sharedClient.registerCodec(new GroupChatInviteCodec());
    sharedClient.registerCodec(new GroupChatMemberAddedCodec());
    sharedClient.registerCodec(new GroupChatMemberRemovedCodec());

    this._members = groupChatInvite.members;

    this.sharedKeys.push(sharedWallet.privateKey);
    this.sharedClients.push(sharedClient);
  }

  async streamMessages(): Promise<AsyncGenerator<DecodedMessage>> {
    return this.sharedClient.conversations.streamAllMessages();
  }

  async send(message: string, fromClient: Client) {
    const conversation = await fromClient.conversations.newConversation(
      this.sharedClient.address,
      {
        conversationId: "",
        metadata: {
          type: "group-chat",
        },
      },
    );

    await conversation.send(message);
  }

  async messages(): Promise<DecodedMessage[]> {
    const messages: DecodedMessage[] = [];

    for (const client of this.sharedClients) {
      const conversations = await client.conversations.list();

      for (const conversation of conversations) {
        const conversationMessages = await conversation.messages();
        messages.push(
          ...conversationMessages.filter(
            (m) => m.senderAddress !== this.sharedClient.address,
          ),
        );
      }
    }

    return messages.sort((a, b) => Number(a.sent) - Number(b.sent));
  }

  async sendInvite(member: string, sharedKeyPrivateKey: Uint8Array) {
    const bundle = await this.sharedClient.getUserContact(member);

    console.log("Sending invite from", this.sharedClient.address, "to", member);

    if (!bundle) {
      console.log("No bundle found for member", member);
      throw new Error("No bundle found for member");
    }

    const sharedSecret = secp.getSharedSecret(
      sharedKeyPrivateKey,
      bundle.identityKey.secp256k1Uncompressed.bytes,
      false,
    );

    const encryptedSharedWallet = await encrypt(
      hexToBytes(this.sharedKey),
      sharedSecret,
    );

    const invite: GroupChatInvite = {
      members: this.members,
      sender: bytesToHex(this.sharedClient.publicKeyBundle.toBytes()),
      groupChatAddress: this.address,
      encryptedSharedWallet: bytesToHex(encryptedSharedWallet.toBytes()),
    };

    const conversation = await this.sharedClient.conversations.newConversation(
      member,
      {
        conversationId: "",
        metadata: {
          type: "group-chat",
          address: this.address,
        },
      },
    );

    await conversation.send(invite, {
      contentType: ContentTypeGroupChatInvite,
      contentFallback: "Group chat invitation",
    });
  }

  async removeMember(member: string, removerClient: Client) {
    this.members = this.members.filter((m) => m !== member);

    const sharedWallet = Wallet.createRandom();
    const sharedClient = await Client.create(sharedWallet);
    sharedClient.registerCodec(new GroupChatInviteCodec());
    sharedClient.registerCodec(new GroupChatMemberAddedCodec());
    sharedClient.registerCodec(new GroupChatMemberRemovedCodec());

    this.sharedClients.push(sharedClient);
    this.sharedKeys.push(sharedWallet.privateKey);

    await this.sendInvites();

    const conversation = await removerClient.conversations.newConversation(
      this.sharedClient.address,
      {
        conversationId: "",
        metadata: {
          type: "group-chat",
          address: this.address,
        },
      },
    );

    const memberRemoved: GroupChatMemberRemoved = {
      removedMember: member,
      remover: removerClient.address,
      newSharedKey: sharedWallet.privateKey,
    };

    await conversation.send(memberRemoved, {
      contentType: ContentTypeGroupChatMemberRemoved,
    });
  }

  async addMember(member: string, adderClient: Client) {
    const sharedKeyBundle =
      await this.sharedClient.keystore.getPrivateKeyBundle();
    const sharedKeyPrivateKey = sharedKeyBundle.identityKey?.secp256k1?.bytes;

    if (!sharedKeyPrivateKey) {
      throw new Error("No shared private key found");
    }

    const conversation = await adderClient.conversations.newConversation(
      this.sharedClient.address,
      {
        conversationId: "",
        metadata: {
          type: "group-chat",
          address: this.address,
        },
      },
    );

    const memberAdded: GroupChatMemberAdded = {
      member,
      adder: adderClient.address,
    };

    await conversation.send(memberAdded, {
      contentType: ContentTypeGroupChatMemberAdded,
    });

    this._members.push(member);
    await this.sendInvite(member, sharedKeyPrivateKey);
  }

  static async start(
    creatorClient: Client,
    members: string[],
  ): Promise<Conversation> {
    const sharedWallet = Wallet.createRandom();
    const sharedClient = await Client.create(sharedWallet);

    sharedClient.registerCodec(new GroupChatInviteCodec());
    sharedClient.registerCodec(new GroupChatMemberAddedCodec());
    sharedClient.registerCodec(new GroupChatMemberRemovedCodec());

    const groupChat = new GroupChat(sharedClient.address);
    groupChat._members = members;
    groupChat.sharedClients = [sharedClient];
    groupChat.sharedKeys = [sharedWallet.privateKey];

    await groupChat.sendInvites();

    const conversation = await creatorClient.conversations.newConversation(
      sharedWallet.address,
      {
        conversationId: "",
        metadata: {
          type: "group-chat",
          address: sharedWallet.address,
        },
      },
    );

    return conversation;
  }

  async sendInvites() {
    const sharedKeyBundle =
      await this.sharedClient.keystore.getPrivateKeyBundle();
    const sharedKeyPrivateKey = sharedKeyBundle.identityKey?.secp256k1?.bytes;

    if (!sharedKeyPrivateKey) {
      throw new Error("No shared private key found");
    }

    for (const member of this.members) {
      await this.sendInvite(member, sharedKeyPrivateKey);
    }
  }
}
