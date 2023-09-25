import type { CachedMessageWithId } from "@xmtp/react-sdk";
import { useClient } from "@xmtp/react-sdk";
import { FullMessage } from "../component-library/components/FullMessage/FullMessage";
import { shortAddress } from "../helpers";
import MessageContentController from "./MessageContentController";
import { useXmtpStore } from "../store/xmtp";

interface FullMessageControllerProps {
  message: CachedMessageWithId;
}

export const FullMessageController = ({
  message,
}: FullMessageControllerProps) => {
  const { client } = useClient();
  const recipientName = useXmtpStore((s) => s.recipientName);

  return (
    <FullMessage
      message={message}
      key={message.xmtpID}
      from={{
        displayAddress: recipientName ?? shortAddress(message.senderAddress),
        isSelf: client?.address === message.senderAddress,
      }}
      datetime={message.sentAt}>
      <MessageContentController
        message={message}
        isSelf={client?.address === message.senderAddress}
      />
    </FullMessage>
  );
};
