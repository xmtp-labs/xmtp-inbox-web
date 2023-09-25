import { useEffect, useMemo } from "react";
import { useDb } from "@xmtp/react-sdk";
import { useXmtpStore } from "../store/xmtp";
import useListConversations from "../hooks/useListConversations";
import { ConversationList } from "../component-library/components/ConversationList/ConversationList";
import getFilteredConversations from "../helpers/getFilteredConversations";
import { MessagePreviewCardController } from "./MessagePreviewCardController";
import { XMTP_FEEDBACK_ADDRESS } from "../helpers";
import useStartFeedbackConvo from "../hooks/useStartFeedbackConvo";
import useStreamAllMessages from "../hooks/useStreamAllMessages";
import { findFeedbackConversation } from "../helpers/findFeedbackConversation";
import { throttledUpdateConversationIdentities } from "../helpers/conversation";

type ConversationListControllerProps = {
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
};

export const ConversationListController = ({
  setStartedFirstMessage,
}: ConversationListControllerProps) => {
  const { isLoaded, isLoading, conversations } = useListConversations();
  const { db } = useDb();
  useStartFeedbackConvo();
  useStreamAllMessages();
  const recipientInput = useXmtpStore((s) => s.recipientInput);

  // when the conversations are loaded, update their identities
  useEffect(() => {
    const updateConversationIdentities = async () => {
      if (isLoaded) {
        await throttledUpdateConversationIdentities(conversations, db);
      }
    };
    void updateConversationIdentities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const feedbackConversation = useMemo(
    () => findFeedbackConversation(conversations),
    [conversations],
  );

  const filteredConversations = useMemo(() => {
    const filtered = getFilteredConversations(conversations).map(
      (conversation) => (
        <MessagePreviewCardController
          key={conversation.topic}
          convo={conversation}
        />
      ),
    );
    return feedbackConversation
      ? [
          <MessagePreviewCardController
            key={XMTP_FEEDBACK_ADDRESS}
            convo={feedbackConversation}
          />,
          ...filtered,
        ]
      : filtered;
  }, [conversations, feedbackConversation]);

  return (
    <ConversationList
      hasRecipientEnteredValue={!!recipientInput}
      setStartedFirstMessage={() => setStartedFirstMessage(true)}
      isLoading={isLoading}
      messages={!isLoading ? filteredConversations : []}
    />
  );
};
