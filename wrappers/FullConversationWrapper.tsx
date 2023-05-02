import React, { useState } from "react";
import { DateDivider } from "../component-library/components/DateDivider/DateDivider";
import { FullConversation } from "../component-library/components/FullConversation/FullConversation";
import useGetMessages from "../hooks/useGetMessages";
import { useXmtpStore } from "../store/xmtp";
import { FullMessageWrapper } from "./FullMessageWrapper.";
import { Virtuoso } from "react-virtuoso";
import { MESSAGE_LIMIT } from "../helpers";

export const FullConversationWrapper = () => {
  let lastMessageDate: Date;

  const conversationId = useXmtpStore((state) => state.conversationId);

  // Local state
  const [firstItemIndex, setFirstItemIndex] = useState(0);

  // XMTP State
  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );

  // XMTP Hooks
  const { messages = [], next } = useGetMessages(conversationId as string);

  const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
    return d1?.toDateString() === d2?.toDateString();
  };

  return (
    <div
      id="scrollableDiv"
      tabIndex={0}
      className="w-full h-full flex flex-col flex-col-reverse overflow-auto">
      <FullConversation isLoading={loadingConversations}>
        <Virtuoso
          className="h-full"
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={MESSAGE_LIMIT - 1}
          data={messages}
          startReached={() => {
            console.log("start reached, getting next messages...");
            next();
          }}
          itemContent={(index, msg) => {
            const dateHasChanged = lastMessageDate
              ? !isOnSameDay(lastMessageDate, msg.sent)
              : false;
            const messageDiv = (
              <div key={`${msg.id}_${index}`}>
                {messages.length === 1 || index === messages.length - 1 ? (
                  <DateDivider date={msg.sent} />
                ) : null}
                <FullMessageWrapper msg={msg} idx={index} />
                {dateHasChanged ? <DateDivider date={lastMessageDate} /> : null}
              </div>
            );
            lastMessageDate = msg.sent;
            return messageDiv;
          }}
        />
      </FullConversation>
    </div>
  );
};
