import { ContentTypeId, DecodedMessage } from "@xmtp/xmtp-js";
import React, { FC, useState } from "react";
import Emoji from "react-emoji-render";
import Avatar from "../Avatar";
import { formatTime } from "../../helpers";
import AddressPill from "../AddressPill";
import InfiniteScroll from "react-infinite-scroll-component";
import useWindowSize from "../../hooks/useWindowSize";
import { address } from "../Address";
import ReactionShortEmojiPicker from "./ReactionShortEmojiPicker";
import ReactionsPreview from "./ReactionsPreview";
import { useAccount } from "wagmi";
import { ContentTypeReaction, Reaction } from "../../codecs/Reaction";
import { Tooltip } from "react-tippy";

import "react-tippy/dist/tippy.css";


export type MessageListProps = {
  messages: DecodedMessage[];
  fetchNextMessages: () => void;
  hasMore: boolean;
  onSend: (
    msg: string | Reaction,
    contentType?: ContentTypeId,
    contentFallback?: string,
  ) => Promise<void>;
};

type MessageTileProps = {
  message: DecodedMessage;
  onSend: (
    msg: string | Reaction,
    contentType?: ContentTypeId,
    contentFallback?: string,
  ) => Promise<void>;
  reactionMessages: DecodedMessage[];
};

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString();
};

const formatDate = (d?: Date) =>
  d?.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const MessageTile = ({
  message,
  onSend,
  reactionMessages,
}: MessageTileProps): JSX.Element => {
  const { address } = useAccount();

  const handleReact = (emoji: string) => {
    const reaction: Reaction = {
      reactingToID: message?.id,
      emoji,
    };

    onSend(reaction, ContentTypeReaction, emoji);
  };

  const reactions: Reaction[] = reactionMessages.map(
    (reactionMsg) => reactionMsg?.content,
  );

  const isReacted = Boolean(
    reactionMessages.filter(
      (reactionMsg) => reactionMsg?.senderAddress === address,
    ).length,
  );

  const [emojiBtnVisible, setEmojiBtnVisible] = useState(false);

  return (
    <div
      className={"flex items-start mx-auto mb-4"}
      onMouseOver={() => setEmojiBtnVisible(true)}
      onMouseOut={() => setEmojiBtnVisible(false)}>
      <Avatar peerAddress={message.senderAddress as address} />
      <div className="ml-2 max-w-[90%]">
        <div className="flex items-center">
          <AddressPill address={message.senderAddress as address} />
          <span className="text-sm font-normal place-self-end text-n-300 text-md uppercase h-full my-auto">
            {formatTime(message.sent)}
          </span>

          {/* @ts-ignore */}
          <Tooltip
            position="top-end"
            trigger="click"
            theme="transparent"
            animation="scale"
            duration={200}
            interactive
            animateFill={false}
            html={
              <ReactionShortEmojiPicker
                isMyMessage={address === message.senderAddress}
                handleReact={handleReact}
              />
            }>
            <button
              className={
                "rounded-full bg-[#E9E9EF] ml-2 p-[2.5px] border outline-none transition-all duration-300"
              }
              style={
                isReacted
                  ? { display: "none" }
                  : emojiBtnVisible
                  ? { opacity: "1" }
                  : { opacity: "0" }
              }>
              😀
            </button>
          </Tooltip>
        </div>
        <span
          className="block text-md px-2 mt-2 text-black font-normal break-words"
          data-testid={"message-tile-text"}>
          {message.error ? (
            `Error: ${message.error?.message}`
          ) : (
            <Emoji text={message.content?.toString() || ""} />
          )}
        </span>
        {reactions.length > 0 && (
          // @ts-ignore
          <Tooltip
            position="top-end"
            trigger="click"
            theme="transparent"
            animation="scale"
            duration={200}
            interactive
            animateFill={false}
            html={
              <ReactionsPreview
                isMyMessage={address === message.senderAddress}
                reactions={reactionMessages.map((reactionMsg) => ({
                  ...reactionMsg.content,
                  senderAddress: reactionMsg.senderAddress,
                }))}
              />
            }>
            <button
              className={
                "mt-1 text-[14px] rounded-full bg-[#E9E9EF] shadow border max-w-[150px] h-[26px] min-h-[26px] flex items-center gap-1 px-[6px] cursor-pointer"
              }>
              {reactions.slice(0, 2).map((reaction, index) => (
                <span key={index}>{reaction?.emoji}</span>
              ))}

              {reactions.length > 1 && (
                <span className="text-sideBarLink">{reactions.length}</span>
              )}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const DateDividerBorder: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <>
    <div className="grow h-0.5 bg-gray-300/25" />
    {children}
    <div className="grow h-0.5 bg-gray-300/25" />
  </>
);

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <div className="flex align-items-center items-center pb-8 pt-4">
    <DateDividerBorder>
      <span className="mx-11 flex-none text-gray-300 text-sm font-bold">
        {formatDate(date)}
      </span>
    </DateDividerBorder>
  </div>
);

const ConversationBeginningNotice = (): JSX.Element => (
  <div className="flex align-items-center justify-center pb-4 mt-4">
    <span
      className="text-gray-300 text-sm font-semibold"
      data-testid="message-beginning-text">
      This is the beginning of the conversation
    </span>
  </div>
);

const LoadingMore: FC = () => (
  <div className="p-1 mt-6 text-center text-gray-300 font-bold text-sm">
    Loading Messages...
  </div>
);

const MessagesList = ({
  messages,
  fetchNextMessages,
  hasMore,
  onSend,
}: MessageListProps): JSX.Element => {
  let lastMessageDate: Date | undefined;
  const size = useWindowSize();

  const reactionMessages: DecodedMessage[] = messages.filter(
    (msg) => msg?.contentType.typeId === ContentTypeReaction.typeId,
  );

  return (
    <InfiniteScroll
      dataLength={messages.length}
      next={fetchNextMessages}
      className="flex flex-col-reverse overflow-y-auto pl-4"
      height={size[1] > 700 ? "87vh" : "83vh"}
      inverse
      endMessage={!messages.length && <ConversationBeginningNotice />}
      hasMore={hasMore}
      loader={<LoadingMore />}>
      <div
        className="flex flex-col-reverse"
        data-testid="message-tile-container">
        {messages?.map((msg: DecodedMessage, index: number) => {
          const dateHasChanged = lastMessageDate
            ? !isOnSameDay(lastMessageDate, msg.sent)
            : false;
          const messageDiv = (
            <div key={`${msg.id}_${index}`}>
              {index === messages.length - 1 ? (
                <ConversationBeginningNotice />
              ) : null}
              <MessageTile
                message={msg}
                onSend={onSend}
                reactionMessages={reactionMessages.filter(
                  (reactionMsg) =>
                    reactionMsg?.content?.reactingToID === msg?.id,
                )}
              />
              {dateHasChanged ? <DateDivider date={lastMessageDate} /> : null}
            </div>
          );
          lastMessageDate = msg.sent;
          return msg.contentType.typeId === ContentTypeReaction?.typeId
            ? null
            : messageDiv;
        })}
      </div>
    </InfiniteScroll>
  );
};

export default React.memo(MessagesList);
