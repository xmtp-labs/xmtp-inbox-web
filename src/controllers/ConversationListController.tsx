/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo } from "react";
import { useDb } from "@xmtp/react-sdk";
import { getEvents } from "zeekaptcha";
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
  const activeTab = useXmtpStore((s) => s.activeTab);
  const { db } = useDb();
  useStreamAllMessages();
  const recipientInput = useXmtpStore((s) => s.recipientInput);

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

  const getCaptchaCheck = async (address: string) => {
    try {
      const response = await getEvents(address);

      // This is just a dummy field -- not sure what the actual shape of the above response is since I only get back undefined
      const hasPassedCaptcha = response.passedCaptcha;

      const addressesCheckedForCaptcha = JSON.parse(
        window.localStorage.getItem("addressesCheckedForCaptcha") || "{}",
      );

      addressesCheckedForCaptcha[address] = hasPassedCaptcha;

      window.localStorage.setItem(
        "addressesCheckedForFraud",
        JSON.stringify(addressesCheckedForCaptcha),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("error", e);
    }
  };

  const filteredConversations = useMemo(() => {
    const convos = conversations.map((conversation) => {
      const addressesCheckedForCaptcha = JSON.parse(
        window.localStorage.getItem("addressesCheckedForCaptcha") || "{}",
      );
      const hasPassedCaptcha =
        addressesCheckedForCaptcha[conversation.peerAddress];

      if (!hasPassedCaptcha) {
        void getCaptchaCheck(conversation.peerAddress);
      }
      return (
        <MessagePreviewCardController
          key={conversation.topic}
          convo={conversation}
          hasPassedCaptcha={hasPassedCaptcha}
        />
      );
    });
    return convos;
  }, [conversations]);

  const { spamConvos, nonSpamConvos } = filteredConversations.reduce<{
    spamConvos: { props: { spamScore: number } }[];
    nonSpamConvos: { props: { spamScore: number } }[];
  }>(
    (acc, item) => {
      // UPDATE THRESHOLD HERE
      const threshold = 10;
      if (item.props.spamScore > threshold) {
        acc.spamConvos.push(item);
      } else if (item.props.spamScore <= threshold) {
        acc.nonSpamConvos.push(item);
      }
      return acc;
    },
    { spamConvos: [], nonSpamConvos: [] },
  );

  return (
    <ConversationList
      hasRecipientEnteredValue={!!recipientInput}
      setStartedFirstMessage={() => setStartedFirstMessage(true)}
      isLoading={isLoading}
      // @ts-ignore
      messages={
        !isLoading
          ? activeTab === "Messages"
            ? nonSpamConvos
            : spamConvos
          : []
      }
    />
  );
};
