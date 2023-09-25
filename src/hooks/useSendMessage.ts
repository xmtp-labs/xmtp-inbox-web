import { useCallback } from "react";
import type { CachedConversation } from "@xmtp/react-sdk";
import { useSendMessage as _useSendMessage } from "@xmtp/react-sdk";
import type {
  Attachment,
  RemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import {
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec,
  AttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import { Web3Storage } from "web3.storage";
import { useTranslation } from "react-i18next";
import Upload from "../helpers/classes/Upload";
import { useXmtpStore } from "../store/xmtp";

const useSendMessage = (attachment?: Attachment) => {
  const { t } = useTranslation();
  const { sendMessage: _sendMessage, isLoading, error } = _useSendMessage();
  const recipientOnNetwork = useXmtpStore((s) => s.recipientOnNetwork);

  const sendMessage = useCallback(
    async (
      conversation: CachedConversation,
      message: string | Attachment,
      type: "text" | "attachment",
    ) => {
      if (!recipientOnNetwork) {
        return;
      }
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

        void _sendMessage(
          conversation,
          remoteAttachment,
          ContentTypeRemoteAttachment,
          {
            contentFallback:
              t("status_messaging.file_unsupported", {
                FILENAME: remoteAttachment.filename,
              }) || remoteAttachment.filename,
          },
        );
      } else if (type === "text") {
        void _sendMessage(conversation, message);
      }
    },
    [recipientOnNetwork, attachment, _sendMessage, t],
  );

  return {
    sendMessage,
    loading: isLoading,
    error,
  };
};

export default useSendMessage;
