import { useEffect, useMemo } from "react";
import { useConsent, useDb } from "@xmtp/react-sdk";
import { useXmtpStore } from "../store/xmtp";
import useListConversations from "../hooks/useListConversations";
import { ConversationList } from "../component-library/components/ConversationList/ConversationList";
import { MessagePreviewCardController } from "./MessagePreviewCardController";
import useStreamAllMessages from "../hooks/useStreamAllMessages";
import { updateConversationIdentities } from "../helpers/conversation";

type ConversationListControllerProps = {
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
};

export const ConversationListController = ({
  setStartedFirstMessage,
}: ConversationListControllerProps) => {
  const { isLoaded, isLoading, conversations } = useListConversations();

  const { db } = useDb();
  useStreamAllMessages();
  const recipientInput = useXmtpStore((s) => s.recipientInput);
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
  }, [isLoaded]);

  const getStatus = async (address: string) => {
    // const {} = useConsent(address)
    // try {
    //   c
    //   // Right now, if any captchas pass, we consider the account safe
    //   const hasPassedCaptcha = !!response.length;
    //   const addressesCheckedForCaptcha = JSON.parse(
    //     window.localStorage.getItem("addressesCheckedForCaptcha") || "{}",
    //   );
    //   addressesCheckedForCaptcha[address] = hasPassedCaptcha;
    //   window.localStorage.setItem(
    //     "addressesCheckedForCaptcha",
    //     JSON.stringify(addressesCheckedForCaptcha),
    //   );
    // } catch (e) {
    //   // eslint-disable-next-line no-console
    //   console.log("error", e);
    // }
  };

  const filteredConversations = useMemo(() => {
    const convos = conversations.map((conversation) => {
      const tab = getStatus(conversation.peerAddress);
      return (
        <MessagePreviewCardController
          key={conversation.topic}
          convo={conversation}
          tab={tab}
        />
      );
    });
    return convos;
  }, [conversations]);

  // change string to enum
  const { blocked, requested, allowed } = filteredConversations.reduce<{
    blocked: { props: { tab: string } }[];
    requested: { props: { tab: string } }[];
    allowed: { props: { tab: string } }[];
  }>(
    (acc, item) => {
      if (item.props.tab === "blocked") {
        acc.blocked.push(item);
      } else if (item.props.tab === "allowed") {
        acc.allowed.push(item);
      } else {
        acc.requested.push(item);
      }
      return acc;
    },
    { blocked: [], requested: [], allowed: [] },
  );

  return (
    <ConversationList
      hasRecipientEnteredValue={!!recipientInput}
      setStartedFirstMessage={() => setStartedFirstMessage(true)}
      isLoading={isLoading}
      messages={
        !isLoading
          ? activeTab === "Messages"
            ? allowed
            : activeTab === blocked
            ? blocked
            : requested
          : []
      }
    />
  );
};
