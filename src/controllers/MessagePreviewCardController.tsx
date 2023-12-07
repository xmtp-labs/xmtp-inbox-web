import {
  useLastMessage,
  type CachedConversation,
  ContentTypeId,
  ContentTypeText,
} from "@xmtp/react-sdk";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ContentTypeReply, type Reply } from "@xmtp/content-type-reply";
import type { Attachment } from "@xmtp/content-type-remote-attachment";
import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import type { Reaction } from "@xmtp/content-type-reaction";
import { ContentTypeReaction } from "@xmtp/content-type-reaction";
import { MessagePreviewCard } from "../component-library/components/MessagePreviewCard/MessagePreviewCard";
import type { ETHAddress } from "../helpers";
import { shortAddress } from "../helpers";
import { useXmtpStore } from "../store/xmtp";
import {
  getCachedPeerAddressAvatar,
  getCachedPeerAddressName,
} from "../helpers/conversation";

interface MessagePreviewCardControllerProps {
  convo: CachedConversation;
}

export const MessagePreviewCardController = ({
  convo,
}: MessagePreviewCardControllerProps) => {
  const { t } = useTranslation();
  const lastMessage = useLastMessage(convo.topic);
  // XMTP State
  const recipientAddress = useXmtpStore((s) => s.recipientAddress);
  const activeTab = useXmtpStore((s) => s.activeTab);

  const setRecipientInput = useXmtpStore((s) => s.setRecipientInput);
  const setRecipientAddress = useXmtpStore((s) => s.setRecipientAddress);
  const setRecipientName = useXmtpStore((s) => s.setRecipientName);
  const setRecipientAvatar = useXmtpStore((s) => s.setRecipientAvatar);
  const setRecipientState = useXmtpStore((s) => s.setRecipientState);
  const setRecipientOnNetwork = useXmtpStore((s) => s.setRecipientOnNetwork);
  const setConversationTopic = useXmtpStore((s) => s.setConversationTopic);
  const setActiveMessage = useXmtpStore((s) => s.setActiveMessage);

  const conversationTopic = useXmtpStore((state) => state.conversationTopic);

  // Helpers
  const isSelected = conversationTopic === convo.topic;

  const onConvoClick = useCallback(
    (conversation: CachedConversation) => {
      if (recipientAddress !== conversation.peerAddress) {
        const peerAddress = conversation.peerAddress as ETHAddress;
        const avatar = getCachedPeerAddressAvatar(conversation);
        setRecipientAvatar(avatar);
        const name = getCachedPeerAddressName(conversation);
        setRecipientName(name);
        setRecipientAddress(peerAddress);
        setRecipientOnNetwork(true);
        setRecipientState("valid");
        setRecipientInput(peerAddress);
      }
      if (conversationTopic !== conversation.topic) {
        setConversationTopic(conversation.topic);
        setActiveMessage();
      }
    },
    [
      conversationTopic,
      recipientAddress,
      setConversationTopic,
      setRecipientAddress,
      setRecipientAvatar,
      setRecipientInput,
      setRecipientName,
      setRecipientOnNetwork,
      setRecipientState,
      setActiveMessage,
    ],
  );

  const conversationDomain = convo?.context?.conversationId.split("/")[0] ?? "";

  const messagePreview = useMemo(() => {
    if (lastMessage) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let previewContent = lastMessage.content;
      let previewContentType = ContentTypeId.fromString(
        lastMessage.contentType,
      );

      if (ContentTypeReply.sameAs(previewContentType)) {
        const reply = lastMessage.content as Reply;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        previewContent = reply.content;
        previewContentType = reply.contentType;
      }

      if (ContentTypeReaction.sameAs(previewContentType)) {
        return (previewContent as Reaction).action === "removed"
          ? t("messages.unreaction_preview", {
              REACTION: (previewContent as Reaction).content,
            })
          : t("messages.reaction_preview", {
              REACTION: (previewContent as Reaction).content,
            });
      }

      if (ContentTypeText.sameAs(previewContentType)) {
        return (previewContent as string) ?? lastMessage.contentFallback;
      }

      if (
        ContentTypeAttachment.sameAs(previewContentType) ||
        ContentTypeRemoteAttachment.sameAs(previewContentType)
      ) {
        return (
          (previewContent as Attachment).filename ??
          (t("messages.attachment") || "Attachment")
        );
      }

      return lastMessage.contentFallback ?? t("messages.no_preview");
    }
    return t("messages.no_preview");
  }, [lastMessage, t]);

  return (
    <MessagePreviewCard
      isSelected={isSelected}
      key={lastMessage?.xmtpID}
      text={messagePreview}
      datetime={convo?.updatedAt}
      displayAddress={
        getCachedPeerAddressName(convo) ??
        shortAddress(convo?.peerAddress || "")
      }
      onClick={() => {
        if (convo) {
          void onConvoClick?.(convo);
        }
      }}
      avatarUrl={getCachedPeerAddressAvatar(convo) || ""}
      conversationDomain={shortAddress(conversationDomain)}
      address={convo?.peerAddress}
      activeTab={activeTab}
    />
  );
};
