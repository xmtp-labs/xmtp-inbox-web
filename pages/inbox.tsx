import React from "react";
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

export type address = "0x${string}";

const Inbox: React.FC<{ children?: React.ReactNode }> = () => {
  useInitXmtpClient();
  // XMTP Store
  const conversations = useXmtpStore((state) => state.conversations);
  const recipientEnteredValue = useXmtpStore(
    (state) => state.recipientEnteredValue,
  );

  const previewMessages = useXmtpStore((state) => state.previewMessages);
  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );

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
      <div className="flex md:w-1/2 md:min-w-fit">
        <SideNavWrapper />
        <div className="w-full max-w-lg flex flex-col h-screen overflow-scroll">
          {!loadingConversations && <HeaderDropdownWrapper />}
          <ConversationList
            isLoading={loadingConversations}
            messages={
              // If there is a value entered but no conversations yet, show placeholder message.
              recipientEnteredValue && !conversations.size
                ? [<MessagePreviewCardWrapper />]
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
      <div className="flex flex-col w-full h-full">
        <AddressInputWrapper />
        <div className="h-full w-full flex flex-col-reverse overflow-scroll">
          <FullConversationWrapper />
        </div>
        <MessageInputWrapper />
      </div>
    </div>
  );
};

export default Inbox;
