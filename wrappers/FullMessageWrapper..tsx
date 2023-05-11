import React from "react";
import { useEnsName } from "wagmi";
import { FullMessage } from "../component-library/components/FullMessage/FullMessage";
import { isValidLongWalletAddress, shortAddress } from "../helpers";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";
import MessageContentWrapper from "./MessageContentWrapper";
import { DecodedMessage, useClient } from "@xmtp/react-sdk";
import { ContentTypeGroupChatInvite } from "../lib/GroupChatInviteCodec";
import type { GroupChatInvite } from "../lib/GroupChatInviteCodec";

interface FullMessageWrapperProps {
  message: DecodedMessage;
  idx: number;
}

export const FullMessageWrapper = ({
  message,
  idx,
}: FullMessageWrapperProps) => {
  const { client } = useClient();

  // Get ENS if exists from full address
  const { data: ensName } = useEnsName({
    address: message.senderAddress as address,
    enabled: isValidLongWalletAddress(message.senderAddress),
  });

  if (message.contentType.sameAs(ContentTypeGroupChatInvite)) {
    const groupChatInvite = message.content as GroupChatInvite;
    return (
      <div className="text-center">
        Group chat with {groupChatInvite.members.length - 1} other wallet
        {groupChatInvite.members.length - 1 !== 1 && "s"}
      </div>
    );
  }

  return (
    <FullMessage
      text={<MessageContentWrapper message={message} />}
      key={`${message.id}_${idx}`}
      from={{
        displayAddress: ensName ? ensName : shortAddress(message.senderAddress),
        isSelf: client?.address === message.senderAddress,
      }}
      datetime={message.sent}
    />
  );
};
