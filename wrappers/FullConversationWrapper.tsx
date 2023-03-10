import { format } from "date-fns";
import React, { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FullConversation } from "../component-library/components/FullConversation/FullConversation";
import { FullMessage } from "../component-library/components/FullMessage/FullMessage";
import { isValidLongWalletAddress, shortAddress } from "../helpers";
import useGetMessages from "../hooks/useGetMessages";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import { useXmtpStore } from "../store/xmtp";

export const FullConversationWrapper = () => {
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
          return (
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
              showDateDivider={
                index === messages.length - 1 ||
                format(msg.sent, "PPP") !==
                  format(messages[index + 1].sent, "PPP")
              }
            />
          );
        })}
      />
    </InfiniteScroll>
  );
};
