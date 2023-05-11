import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentTypeGroupChatInvite: ContentTypeId = {
  typeId: "groupChatInvite",
  authorityId: "pat.xmtp.com",
  versionMajor: 1,
  versionMinor: 0,
  sameAs(id) {
    return (
      this.typeId === id.typeId &&
      this.authorityId === id.authorityId &&
      this.versionMajor === id.versionMajor &&
      this.versionMinor === id.versionMinor
    );
  },
};

export type GroupChatInvite = {
  members: string[];
  sender: string;
  groupChatAddress: string;
  encryptedSharedWallet: string;
};

export class GroupChatInviteCodec implements ContentCodec<GroupChatInvite> {
  contentType = ContentTypeGroupChatInvite;

  encode(content: GroupChatInvite): EncodedContent {
    return {
      type: ContentTypeGroupChatInvite,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    };
  }

  decode(encodedContent: EncodedContent): GroupChatInvite {
    const json = new TextDecoder().decode(encodedContent.content);
    return JSON.parse(json);
  }
}
