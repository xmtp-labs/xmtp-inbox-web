import React, { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DateDivider } from "../component-library/components/DateDivider/DateDivider";
import { FullConversation } from "../component-library/components/FullConversation/FullConversation";
import { FullMessage } from "../component-library/components/FullMessage/FullMessage";
import { isValidLongWalletAddress, shortAddress } from "../helpers";
import useGetMessages from "../hooks/useGetMessages";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import { useXmtpStore } from "../store/xmtp";

export const FullConversationWrapper = () => {
  let lastMessageDate: Date;

  // Local state
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());

  // XMTP State
  const client = useXmtpStore((state) => state.client);
  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );

  // XMTP Hooks
  const { conversationId } = useGetRecipientInputMode();
  const { convoMessages: messages = [], hasMore } = useGetMessages(
    conversationId as string,
    endTime.get(conversationId as string),
  );

  const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
    return d1?.toDateString() === d2?.toDateString();
  };

  const fetchNextMessages = useCallback(() => {
    if (
      hasMore &&
      Array.isArray(messages) &&
      messages.length > 0 &&
      conversationId
    ) {
      const lastMsgDate = messages[messages.length - 1].sent;
      const currentEndTime = endTime.get(conversationId);
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(conversationId, lastMsgDate);
        setEndTime(new Map(endTime));
      }
    }
  }, [conversationId, hasMore, messages, endTime]);

  return (
    <InfiniteScroll
      height={"100%"}
      dataLength={messages.length}
      next={fetchNextMessages}
      endMessage={!messages?.length}
      hasMore={hasMore}
      inverse
      loader={false}>
      <FullConversation
        isLoading={loadingConversations}
        messages={messages?.map((msg, index) => {
          const dateHasChanged = lastMessageDate
            ? !isOnSameDay(lastMessageDate, msg.sent)
            : false;
          const messageDiv = (
            <div key={`${msg.id}_${index}`}>
              <FullMessage
                text={msg.content}
                key={`${msg.id}_${index}`}
                from={{
                  displayAddress: isValidLongWalletAddress(msg.senderAddress)
                    ? shortAddress(msg.senderAddress)
                    : msg.senderAddress,
                  isSelf: client?.address === msg.senderAddress,
                }}
                datetime={msg.sent}
              />
              {dateHasChanged ? <DateDivider date={lastMessageDate} /> : null}
            </div>
          );
          lastMessageDate = msg.sent;
          return messageDiv;
        })}
      />
    </InfiniteScroll>
  );
};
