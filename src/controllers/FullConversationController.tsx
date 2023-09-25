import { useMessages, type CachedConversation, useDb } from "@xmtp/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import { isSameDay } from "date-fns";
import { DateDivider } from "../component-library/components/DateDivider/DateDivider";
import { FullConversation } from "../component-library/components/FullConversation/FullConversation";
import { FullMessageController } from "./FullMessageController";
import { isMessageSupported } from "../helpers/isMessagerSupported";
import { updatePeerAddressIdentity } from "../helpers/conversation";

type FullConversationControllerProps = {
  conversation: CachedConversation;
};

export const FullConversationController: React.FC<
  FullConversationControllerProps
> = ({ conversation }) => {
  const lastMessageDateRef = useRef<Date>();
  const renderedDatesRef = useRef<Date[]>([]);
  const { db } = useDb();

  useEffect(() => {
    void updatePeerAddressIdentity(conversation, db);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.peerAddress]);

  // XMTP Hooks
  const { messages, isLoading } = useMessages(conversation);

  const messagesWithDates = useMemo(
    () =>
      messages?.map((msg, index) => {
        // if the message content type is not support and has no fallback,
        // disregard it
        if (!isMessageSupported(msg) && !msg.contentFallback) {
          return null;
        }
        if (renderedDatesRef.current.length === 0) {
          renderedDatesRef.current.push(msg.sentAt);
        }
        const lastRenderedDate = renderedDatesRef.current.at(-1) as Date;
        const isFirstMessage = index === 0;
        const isSameDate = isSameDay(lastRenderedDate, msg.sentAt);
        const shouldDisplayDate = isFirstMessage || !isSameDate;

        if (shouldDisplayDate) {
          renderedDatesRef.current.push(msg.sentAt);
        }

        const messageDiv = (
          <div key={msg.uuid}>
            {shouldDisplayDate && (
              <DateDivider date={renderedDatesRef.current.at(-1) as Date} />
            )}
            <FullMessageController message={msg} />
          </div>
        );
        lastMessageDateRef.current = msg.sentAt;
        return messageDiv;
      }),
    [messages],
  );

  return (
    <div
      id="scrollableDiv"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="w-full h-full flex flex-col overflow-auto">
      <FullConversation isLoading={isLoading} messages={messagesWithDates} />
    </div>
  );
};
