import { useEnsName } from "wagmi";
import type { DecodedMessage } from "@xmtp/react-sdk";
import { useClient } from "@xmtp/react-sdk";
import { FullMessage } from "../component-library/components/FullMessage/FullMessage";
import { isValidLongWalletAddress, shortAddress } from "../helpers";
import type { address } from "../pages/inbox";
import MessageContentController from "./MessageContentController";
import useSendMessage from "../hooks/useSendMessage";
import { useXmtpStore } from "../store/xmtp";

type FullMessageControllerProps = {
  msg: DecodedMessage;
  idx: number;
};

export const FullMessageController: React.FC<FullMessageControllerProps> = ({
  msg,
  idx,
}) => {
  const { client } = useClient();

  // Get ENS if exists from full address
  const { data: ensName } = useEnsName({
    address: msg.senderAddress as address,
    enabled: isValidLongWalletAddress(msg.senderAddress),
  });
  const conversationId = useXmtpStore((state) => state.conversationId);

  const reactions = useXmtpStore((state) => state.reactions);

  const { loading, error } = useSendMessage(conversationId as address);

  return (
    <FullMessage
      text={
        <MessageContentController
          message={msg}
          isSelf={client?.address === msg.senderAddress}
          isLoading={loading}
          isError={!!error}
        />
      }
      isError={!!error}
      key={`${msg.id}_${idx}`}
      from={{
        displayAddress: ensName ?? shortAddress(msg.senderAddress),
        isSelf: client?.address === msg.senderAddress,
      }}
      datetime={msg.sent}
      reactions={reactions.get(msg.id)}
    />
  );
};
