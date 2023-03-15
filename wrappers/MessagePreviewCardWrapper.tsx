import { Conversation } from "@xmtp/xmtp-js";
import React from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { MessagePreviewCard } from "../component-library/components/MessagePreviewCard/MessagePreviewCard";
import { getConversationId, shortAddress } from "../helpers";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";

interface MessagePreviewCardWrapperProps {
  convo?: Conversation;
}
export const MessagePreviewCardWrapper = ({
  convo,
}: MessagePreviewCardWrapperProps) => {
  // XMTP State
  const previewMessages = useXmtpStore((state) => state.previewMessages);
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const setConversationId = useXmtpStore((state) => state.setConversationId);
  const previewMessage = previewMessages.get(getConversationId(convo));

  // XMTP Hooks
  const { conversationId } = useGetRecipientInputMode();

  // Get ENS name and avatar from Wagmi
  const { data: previewEnsName } = useEnsName({
    address: convo?.peerAddress as address,
  });
  const { data: convoAvatarUrl, isLoading: convoAvatarLoading } = useEnsAvatar({
    address: convo?.peerAddress as address,
  });

  // Helpers
  const isSelected = conversationId === getConversationId(convo);

  const onConvoClick = (conversation: Conversation) => {
    if (recipientWalletAddress !== conversation.peerAddress) {
      setRecipientWalletAddress(conversation.peerAddress);
    }
    if (conversationId !== getConversationId(conversation)) {
      setConversationId(getConversationId(conversation));
    }
  };

  return (
    <MessagePreviewCard
      isSelected={isSelected}
      key={previewMessage?.id}
      text={previewMessage?.content}
      datetime={previewMessage?.sent}
      displayAddress={
        previewEnsName || shortAddress(convo?.peerAddress || "") || undefined
      }
      onClick={() => {
        if (convo) {
          onConvoClick?.(convo);
        }
      }}
      isLoading={convoAvatarLoading}
      avatarUrl={convoAvatarUrl || ""}
    />
  );
};
