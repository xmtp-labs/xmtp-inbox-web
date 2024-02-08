import { useEffect, useMemo, useState } from "react";
import { useClient, useConsent, useDb } from "@xmtp/react-sdk";
import type { CachedConversation, CachedMessage } from "@xmtp/react-sdk";
import type { ActiveTab } from "../store/xmtp";
import { useXmtpStore } from "../store/xmtp";
import useListConversations from "../hooks/useListConversations";
import { ConversationList } from "../component-library/components/ConversationList/ConversationList";
import { MessagePreviewCardController } from "./MessagePreviewCardController";
import useStreamAllMessages from "../hooks/useStreamAllMessages";
import { updateConversationIdentities } from "../helpers/conversation";

type ConversationListControllerProps = {
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
};

type ConsentProps = {
  tab: ActiveTab;
  convo: CachedConversation;
};

type NodeWithConsent = React.ReactElement<ConsentProps>;

export const ConversationListController = ({
  setStartedFirstMessage,
}: ConversationListControllerProps) => {
  const { isLoaded, isLoading, conversations } = useListConversations();
  const { isAllowed, isDenied } = useConsent();

  const { db } = useDb();
  // FABRI: Add the below 2 lines back in if needed
  // const [messages, setMessages] = useState<CachedMessage[]>([]);
  // const messagesDb = db.table("messages");

  useStreamAllMessages();
  const { client: walletAddress } = useClient();
  const recipientInput = useXmtpStore((s) => s.recipientInput);
  const changedConsentCount = useXmtpStore((s) => s.changedConsentCount);

  const activeTab = useXmtpStore((s) => s.activeTab);

  // when the conversations are loaded, update their identities
  useEffect(() => {
    const runUpdate = async () => {
      if (isLoaded) {
        await updateConversationIdentities(conversations, db);
      }
    };
    void runUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, activeTab, changedConsentCount]);

  // FABRI: This entire useEffect should not be needed since we no longer want to check for sent messages, but can you see if something else in here is causing this?
  // useEffect(() => {
  // const fetchMessages = async () =>
  //   messagesDb
  //     .where("senderAddress")
  //     .equals(walletAddress?.address as string)
  //     .toArray()
  //     .then((dbMessages: CachedMessage[]) => {
  //       setMessages(dbMessages);
  //     })
  //     .catch((error: Error) => {
  //       console.error("Error querying messages:", error);
  //     });
  // void fetchMessages();
  // }, [conversations.length, messagesDb, walletAddress?.address]);

  const messagesToPass = useMemo(() => {
    const conversationsWithTab = conversations.map(
      (conversation: CachedConversation) => {
        const tab = isAllowed(conversation.peerAddress)
          ? "messages"
          : isDenied(conversation.peerAddress)
          ? "blocked"
          : "requests";
        return (
          <MessagePreviewCardController
            key={conversation.topic}
            convo={conversation}
            tab={tab}
          />
        );
      },
    );
    const sortedConvos = conversationsWithTab.filter(
      (item: NodeWithConsent) => {
        // FABRI: This should not be needed because we are no longer requiring sent message logic
        // const hasSentMessages = messages.find(
        //   (message) => message?.conversationTopic === item.props.convo.topic,
        // );
        const isAddressBlocked = isDenied(item.props.convo.peerAddress);
        const isAddressAllowed = isAllowed(item.props.convo.peerAddress);

        if (activeTab === "messages") {
          return isAddressAllowed;
        }
        if (activeTab === "blocked") {
          return isAddressBlocked;
        }
        if (activeTab === "requests") {
          return !isAddressBlocked && !isAddressAllowed;
        }
        return null;
      },
    );
    return sortedConvos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    conversations,
    // messages,
    isLoading,
    walletAddress,
    db,
    changedConsentCount,
    isAllowed,
    isDenied,
  ]);

  return (
    <ConversationList
      hasRecipientEnteredValue={!!recipientInput}
      setStartedFirstMessage={() => setStartedFirstMessage(true)}
      isLoading={isLoading}
      messages={messagesToPass}
      activeTab={activeTab}
    />
  );
};
