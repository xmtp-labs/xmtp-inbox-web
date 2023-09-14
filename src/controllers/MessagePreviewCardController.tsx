import { useLastMessage, type CachedConversation } from "@xmtp/react-sdk";
import { useCallback, useEffect, useState } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { useTranslation } from "react-i18next";
import { MessagePreviewCard } from "../component-library/components/MessagePreviewCard/MessagePreviewCard";
import {
  XMTP_FEEDBACK_ADDRESS,
  fetchUnsName,
  isValidLongWalletAddress,
  shortAddress,
} from "../helpers";
import type { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";

interface MessagePreviewCardControllerProps {
  convo: CachedConversation;
}

export const MessagePreviewCardController = ({
  convo,
}: MessagePreviewCardControllerProps) => {
  const { t } = useTranslation();
  const lastMessage = useLastMessage(convo.topic);
  // XMTP State
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );

  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const conversationTopic = useXmtpStore((state) => state.conversationTopic);

  // Get ENS name and avatar from Wagmi
  const { data: previewEnsName } = useEnsName({
    address: convo?.peerAddress as address,
  });
  const { data: convoAvatarUrl, isLoading: convoAvatarLoading } = useEnsAvatar({
    address: convo?.peerAddress as address,
  });

  // Get UNS name
  const [previewUnsName, setPreviewUnsName] = useState<string | null>();

  useEffect(() => {
    const getUns = async () => {
      if (isValidLongWalletAddress(convo?.peerAddress || "")) {
        const name = await fetchUnsName(convo?.peerAddress);
        setPreviewUnsName(name);
      } else {
        setPreviewUnsName(null);
      }
    };

    void getUns();
  }, [convo?.peerAddress]);

  // Helpers
  const isSelected = conversationTopic === convo.topic;

  const onConvoClick = useCallback(
    (conversation: CachedConversation) => {
      if (recipientWalletAddress !== conversation.peerAddress) {
        // this will also update the conversation topic
        setRecipientWalletAddress(conversation.peerAddress);
      }
    },
    [recipientWalletAddress, setRecipientWalletAddress],
  );

  const conversationDomain = convo?.context?.conversationId.split("/")[0] ?? "";

  let content = lastMessage?.content
    ? typeof lastMessage.content !== "string"
      ? t("messages.attachment") || "Attachment"
      : lastMessage?.content
    : undefined;

  if (convo.peerAddress === XMTP_FEEDBACK_ADDRESS) {
    content = t("messages.send_feedback") ?? "Send feedback";
  }

  return (
    <MessagePreviewCard
      isSelected={isSelected}
      key={lastMessage?.xmtpID}
      text={content}
      datetime={convo?.updatedAt}
      displayAddress={
        previewEnsName ||
        previewUnsName ||
        shortAddress(convo?.peerAddress || "")
      }
      onClick={() => {
        if (convo) {
          onConvoClick?.(convo);
        }
      }}
      isLoading={convoAvatarLoading}
      avatarUrl={convoAvatarUrl || ""}
      conversationDomain={shortAddress(conversationDomain)}
      pinned={convo?.peerAddress === XMTP_FEEDBACK_ADDRESS}
      address={convo?.peerAddress}
    />
  );
};
