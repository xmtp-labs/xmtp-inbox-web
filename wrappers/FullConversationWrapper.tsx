import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DateDivider } from "../component-library/components/DateDivider/DateDivider";
import { FullConversation } from "../component-library/components/FullConversation/FullConversation";
import { useXmtpStore } from "../store/xmtp";
import { FullMessageWrapper } from "./FullMessageWrapper.";
import useGetMessages from "../hooks/useGetMessages";

export const FullConversationWrapper = () => {
  let lastMessageDate: Date;
  const [initialConversationLoaded, setInitialConversationLoaded] =
    useState(false);

  const conversationId = useXmtpStore((state) => state.conversationId);

  useEffect(() => {
    setInitialConversationLoaded(false);
  }, [conversationId]);

  // XMTP Hooks
  const {
    messages = [],
    hasMore,
    next,
    isLoading,
  } = useGetMessages(conversationId as string);

  const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
    return d1?.toDateString() === d2?.toDateString();
  };

  return (
    <div
      id="scrollableDiv"
      tabIndex={0}
      className="w-full h-full flex flex-col flex-col-reverse overflow-auto">
      <InfiniteScroll
        className="flex flex-col flex-col-reverse"
        dataLength={messages.length}
        next={() => {
          if (!initialConversationLoaded) {
            setInitialConversationLoaded(true);
          }
          next();
        }}
        endMessage={!messages?.length}
        hasMore={hasMore}
        inverse
        loader={true}
        scrollableTarget="scrollableDiv">
        <FullConversation
          isLoading={isLoading && !initialConversationLoaded}
          messages={messages?.map((msg, index) => {
            const dateHasChanged = lastMessageDate
              ? !isOnSameDay(lastMessageDate, msg.sent)
              : false;
            const messageDiv = (
              <div key={`${msg.id}_${index}`}>
                {messages.length === 1 || index === messages.length - 1 ? (
                  <DateDivider date={msg.sent} />
                ) : null}
                <FullMessageWrapper message={msg} idx={index} />
                {dateHasChanged ? <DateDivider date={lastMessageDate} /> : null}
              </div>
            );
            lastMessageDate = msg.sent;
            return messageDiv;
          })}
        />
      </InfiniteScroll>
    </div>
  );
};
