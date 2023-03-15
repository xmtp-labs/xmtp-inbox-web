import React, { useEffect } from "react";
import useListConversations from "../hooks/useListConversations";
import { useXmtpStore } from "../store/xmtp";
import { getConversationId } from "../helpers";
import { ConversationList } from "../component-library/components/ConversationList/ConversationList";
import { Conversation } from "@xmtp/xmtp-js";
import { MessagePreviewCardWrapper } from "../wrappers/MessagePreviewCardWrapper";
import { FullConversationWrapper } from "../wrappers/FullConversationWrapper";
import { AddressInputWrapper } from "../wrappers/AddressInputWrapper";
import { HeaderDropdownWrapper } from "../wrappers/HeaderDropdownWrapper";
import { MessageInputWrapper } from "../wrappers/MessageInputWrapper";
import { SideNavWrapper } from "../wrappers/SideNavWrapper";
import useInitXmtpClient from "../hooks/useInitXmtpClient";
import { LearnMore } from "../component-library/components/LearnMore/LearnMore";
import router from "next/router";

export type address = "0x${string}";

const Inbox: React.FC<{ children?: React.ReactNode }> = () => {
  useInitXmtpClient();
  // XMTP Store
  const client = useXmtpStore((state) => state.client);
  const conversations = useXmtpStore((state) => state.conversations);

  const previewMessages = useXmtpStore((state) => state.previewMessages);
  const recipientEnteredValue = useXmtpStore(
    (state) => state.recipientEnteredValue,
  );

  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );
  const startedFirstMessage = useXmtpStore(
    (state) => state.startedFirstMessage,
  );
  const setStartedFirstMessage = useXmtpStore(
    (state) => state.setStartedFirstMessage,
  );

  useEffect(() => {
    if (!client) {
      router.push("/");
    }
  }, [client]);

  // XMTP Hooks
  useListConversations();

  const orderByLatestMessage = (
    convoA: Conversation,
    convoB: Conversation,
  ): number => {
    const convoALastMessageDate =
      previewMessages.get(getConversationId(convoA))?.sent || new Date();
    const convoBLastMessageDate =
      previewMessages.get(getConversationId(convoB))?.sent || new Date();
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1;
  };

  return (
    <div className="bg-white w-screen md:h-screen flex flex-col md:flex-row">
      <div className="flex md:w-1/2">
        <SideNavWrapper />
        <div className="w-full flex flex-col h-screen overflow-auto">
          {!loadingConversations && <HeaderDropdownWrapper />}
          <ConversationList
            hasRecipientEnteredValue={!!recipientEnteredValue}
            setStartedFirstMessage={setStartedFirstMessage}
            isLoading={loadingConversations}
            messages={
              conversations.size === 0 && recipientEnteredValue
                ? [<MessagePreviewCardWrapper key="default" />]
                : Array.from(conversations.values())
                    .sort(orderByLatestMessage)
                    .map((convo) => (
                      <MessagePreviewCardWrapper
                        key={getConversationId(convo)}
                        convo={convo}
                      />
                    ))
            }
          />
        </div>
      </div>
      <div className="flex w-full flex-col h-screen">
        {!conversations.size &&
        !loadingConversations &&
        !startedFirstMessage ? (
          <LearnMore
            version={"replace"}
            setStartedFirstMessage={setStartedFirstMessage}
          />
        ) : (
          <>
            <AddressInputWrapper />
            <div className="h-full w-full flex flex-col-reverse overflow-auto">
              <FullConversationWrapper />
            </div>
            <MessageInputWrapper />
          </>
        )}
      </div>
    </div>
  );
};

export default Inbox;
