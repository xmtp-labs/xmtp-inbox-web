import React from "react";
import Address, { address } from "../Address";
import { Conversation } from "@xmtp/xmtp-js";
import { classNames, formatDate, getConversationId } from "../../helpers";
import Avatar from "../Avatar";
import { useXmtpStore } from "../../store/xmtp";
import { useAccount } from "wagmi";

type ConversationTileProps = {
  conversation: Conversation;
};

const ConversationTile = ({
  conversation,
}: ConversationTileProps): JSX.Element | null => {
  const { address } = useAccount();
  const previewMessages = useXmtpStore((state) => state.previewMessages);

  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const conversationId = useXmtpStore((state) => state.conversationId);
  const setConversationId = useXmtpStore((state) => state.setConversationId);

  const conversationKey = getConversationId(conversation);

  const onClick = () => {
    setRecipientWalletAddress(conversation.peerAddress);
    setConversationId(conversationKey);
  };

  if (!previewMessages.get(conversationKey)) {
    return null;
  }

  const latestMessage = previewMessages.get(conversationKey);

  const conversationDomain =
    conversation.context?.conversationId.split("/")[0] ?? "";

  const isSelected = conversationId === conversationKey;

  if (!latestMessage) {
    return null;
  }

  let preview: String;
  if (!latestMessage) {
    preview = "";
  } else if (typeof latestMessage.content === "string") {
    preview = latestMessage.content;
  } else {
    preview = "Attachment";
  }

  return (
    <div
      onClick={onClick}
      className={classNames(
        "h-20",
        "py-2",
        "px-4",
        "md:max-w-sm",
        "mx-auto",
        "bg-white",
        "space-y-2",
        "py-2",
        "flex",
        "items-center",
        "space-y-0",
        "space-x-4",
        "border-b-2",
        "border-gray-100",
        "hover:bg-bt-100",
        "cursor-pointer",
        loadingConversations ? "opacity-80" : "opacity-100",
        isSelected ? "bg-bt-200" : null,
      )}>
      <Avatar peerAddress={conversation.peerAddress as address} />
      <div className="py-4 sm:text-left text w-full">
        {conversationDomain && (
          <div className="text-sm rounded-2xl text-white bg-black w-max px-2 font-bold">
            {conversationDomain.toLocaleUpperCase()}
          </div>
        )}
        <div className="grid-cols-2 grid">
          <Address
            address={conversation.peerAddress as address}
            className="text-black text-lg md:text-md font-bold place-self-start"
          />
          <span
            className={classNames(
              "text-sm font-normal place-self-end",
              isSelected ? "text-n-500" : "text-n-300",
              loadingConversations ? "animate-pulse" : "",
            )}>
            {formatDate(latestMessage?.sent)}
          </span>
        </div>
        <span className="text-sm text-gray-500 line-clamp-1 break-all">
          {address === latestMessage?.senderAddress && "You: "} {preview}
        </span>
      </div>
    </div>
  );
};

export default React.memo(ConversationTile);
