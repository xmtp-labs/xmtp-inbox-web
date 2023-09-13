import { useEffect, useMemo, useState } from "react";
import { useXmtpStore } from "../store/xmtp";
import useListConversations from "../hooks/useListConversations";
import { ConversationList } from "../component-library/components/ConversationList/ConversationList";
import getFilteredConversations from "../helpers/getFilteredConversations";
import { MessagePreviewCardController } from "./MessagePreviewCardController";
import { XMTP_FEEDBACK_ADDRESS, fetchUnsNames } from "../helpers";
import useStartFeedbackConvo from "../hooks/useStartFeedbackConvo";
import useStreamAllMessages from "../hooks/useStreamAllMessages";
import { findFeedbackConversation } from "../helpers/findFeedbackConversation";

type ConversationListControllerProps = {
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
};

export const ConversationListController = ({
  setStartedFirstMessage,
}: ConversationListControllerProps) => {
  const { isLoading, conversations } = useListConversations();
  useStartFeedbackConvo();
  useStreamAllMessages();
  const recipientEnteredValue = useXmtpStore(
    (state) => state.recipientEnteredValue,
  );

  const [unsNames, setUnsNames] = useState<{ [key: string]: string } | null>();

  const feedbackConversation = useMemo(
    () => findFeedbackConversation(conversations),
    [conversations],
  );

  useEffect(() => {
    const getUns = async () => {
      let addresses: string[] = [];
      const filtered = getFilteredConversations(conversations);
      filtered.forEach((convo) => {
        if (convo?.peerAddress) {
          addresses.push(convo.peerAddress.toLowerCase());
        }
      });
      addresses = [...new Set(addresses)];
      const names = await fetchUnsNames(addresses);
      setUnsNames(names);
    };

    void getUns();
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const filtered = getFilteredConversations(conversations).map(
      (conversation) => (
        <MessagePreviewCardController
          key={conversation.topic}
          convo={conversation}
          unsNames={unsNames}
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
  }, [conversations, feedbackConversation, unsNames]);

  return (
    <ConversationList
      hasRecipientEnteredValue={!!recipientEnteredValue}
      setStartedFirstMessage={() => setStartedFirstMessage(true)}
      isLoading={isLoading}
      messages={!isLoading ? filteredConversations : []}
    />
  );
};
