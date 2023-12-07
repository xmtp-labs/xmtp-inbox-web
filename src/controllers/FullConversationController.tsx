import {
  useMessages,
  type CachedConversation,
  useDb,
  ContentTypeId,
} from "@xmtp/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import { isSameDay } from "date-fns";
import { ContentTypeReply } from "@xmtp/content-type-reply";
import { DateDivider } from "../component-library/components/DateDivider/DateDivider";
import { FullConversation } from "../component-library/components/FullConversation/FullConversation";
import { FullMessageController } from "./FullMessageController";
import { isMessageSupported } from "../helpers/isMessagerSupported";
import { updateConversationIdentity } from "../helpers/conversation";
import { useXmtpStore } from "../store/xmtp";

type FullConversationControllerProps = {
  conversation: CachedConversation;
};

export const FullConversationController: React.FC<
  FullConversationControllerProps
> = ({ conversation }) => {
  const activeTab = useXmtpStore((s) => s.activeTab);
  const lastMessageDateRef = useRef<Date>();
  const renderedDatesRef = useRef<Date[]>([]);
  const { db } = useDb();

  useEffect(() => {
    void updateConversationIdentity(conversation, db);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.peerAddress]);

  // XMTP Hooks
  const { messages, isLoading } = useMessages(conversation);

  const messagesWithDates = useMemo(
    () =>
      messages?.map((msg, index) => {
        const contentType = ContentTypeId.fromString(msg.contentType);
        // if the message content type is not support and has no fallback,
        // disregard it

        if (
          !isMessageSupported(msg) &&
          (!msg.contentFallback || contentType.sameAs(ContentTypeReply))
        ) {
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
            <FullMessageController message={msg} conversation={conversation} />
          </div>
        );
        lastMessageDateRef.current = msg.sentAt;
        return messageDiv;
      }),
    [messages, conversation],
  );

  return (
    <div
      id="scrollableDiv"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="w-full h-full flex flex-col overflow-auto">
      <FullConversation
        isLoading={isLoading}
        messages={messagesWithDates}
        activeTab={activeTab}
        address={conversation.peerAddress}
      />
    </div>
  );
};
