import { useCallback } from "react";
import type { Conversation } from "@xmtp/react-sdk";
import {
  useSendMessage as useSendMessageHook,
  useStartConversation,
} from "@xmtp/react-sdk";
import {
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec,
  AttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import { Web3Storage } from "web3.storage";
import { useTranslation } from "react-i18next";
import Upload from "../helpers/classes/Upload";
import type { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";
import { getConversationId, isValidLongWalletAddress } from "../helpers";

const useSendMessage = (conversationId: address, attachment?: Attachment) => {
  const { t } = useTranslation();
  const conversations = useXmtpStore((state) => state.conversations);
  const selectedConversation = conversations.get(conversationId);
  const { startConversation, error, isLoading } = useStartConversation<
    RemoteAttachment | string
  >();
  const {
    sendMessage: sendMessageFromHook,
    isLoading: sendingMessageLoading,
    error: sendingMessageError,
  } = useSendMessageHook<RemoteAttachment | string>(
    selectedConversation as Conversation,
  );
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const setConversations = useXmtpStore((state) => state.setConversations);

  const sendMessage = useCallback(
    async (message: string | Attachment, type: "text" | "attachment") => {
      let selectedConvo = conversations.get(conversationId);
      if (attachment && type === "attachment") {
        const web3Storage = new Web3Storage({
          token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
        });

        const encryptedEncoded = await RemoteAttachmentCodec.encodeEncrypted(
          attachment,
          new AttachmentCodec(),
        );

        const upload = new Upload(
          "XMTPEncryptedContent",
          encryptedEncoded.payload,
        );

        const cid = await web3Storage.put([upload]);
        const url = `https://${cid}.ipfs.w3s.link/XMTPEncryptedContent`;
        const remoteAttachment: RemoteAttachment = {
          url,
          contentDigest: encryptedEncoded.digest,
          salt: encryptedEncoded.salt,
          nonce: encryptedEncoded.nonce,
          secret: encryptedEncoded.secret,
          scheme: "https://",
          filename: attachment.filename,
          contentLength: attachment.data.byteLength,
        };

        if (
          isValidLongWalletAddress(recipientWalletAddress) &&
          (!selectedConvo || !selectedConvo?.messages)
        ) {
          const conversation = await startConversation(
            recipientWalletAddress,
            remoteAttachment,
            {
              contentFallback:
                t("status_messaging.file_unsupported", {
                  FILENAME: remoteAttachment.filename,
                }) || remoteAttachment.filename,
              contentType: ContentTypeRemoteAttachment,
            },
          );
          if (conversation) {
            selectedConvo = conversation;
            conversations.set(getConversationId(conversation), conversation);
            setConversations(new Map(conversations));
          }
        } else {
          await sendMessageFromHook(remoteAttachment, {
            contentFallback:
              t("status_messaging.file_unsupported", {
                FILENAME: remoteAttachment.filename,
              }) || remoteAttachment.filename,
            contentType: ContentTypeRemoteAttachment,
          });
        }
      } else if (
        isValidLongWalletAddress(recipientWalletAddress) &&
        (!selectedConvo || !selectedConvo?.messages)
      ) {
        const conversation = await startConversation(
          recipientWalletAddress,
          message as string,
        );

        if (conversation) {
          selectedConvo = conversation;
          conversations.set(getConversationId(conversation), conversation);
          setConversations(new Map(conversations));
        }
      } else {
        await sendMessageFromHook(message as string);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversationId, recipientWalletAddress, conversations, attachment],
  );

  return {
    sendMessage,
    loading: isLoading || sendingMessageLoading,
    error: error || sendingMessageError,
  };
};

export default useSendMessage;
