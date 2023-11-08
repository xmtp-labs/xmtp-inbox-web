import { useLastMessage, type CachedConversation } from "@xmtp/react-sdk";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  hasPassedCaptcha: boolean;
}

export const MessagePreviewCardController = ({
  convo,
  hasPassedCaptcha,
}: MessagePreviewCardControllerProps) => {
  const { t } = useTranslation();
  const lastMessage = useLastMessage(convo.topic);
  // XMTP State
  const recipientAddress = useXmtpStore((s) => s.recipientAddress);
  const setRecipientInput = useXmtpStore((s) => s.setRecipientInput);
  const setRecipientAddress = useXmtpStore((s) => s.setRecipientAddress);
  const setRecipientName = useXmtpStore((s) => s.setRecipientName);
  const setRecipientAvatar = useXmtpStore((s) => s.setRecipientAvatar);
  const setRecipientState = useXmtpStore((s) => s.setRecipientState);
  const setRecipientOnNetwork = useXmtpStore((s) => s.setRecipientOnNetwork);
  const setConversationTopic = useXmtpStore((s) => s.setConversationTopic);
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
    ],
  );

  const conversationDomain = convo?.context?.conversationId.split("/")[0] ?? "";

  const content = lastMessage?.content
    ? typeof lastMessage.content !== "string"
      ? t("messages.attachment") || "Attachment"
      : lastMessage?.content
    : undefined;

  return (
    <MessagePreviewCard
      isSelected={isSelected}
      key={lastMessage?.xmtpID}
      text={content}
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
      pinned={!hasPassedCaptcha}
    />
  );
};
