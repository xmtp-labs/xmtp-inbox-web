import {
  useStreamAllMessages as _useStreamAllMessages,
  useConversation,
} from "@xmtp/react-sdk";
import type { DecodedMessage } from "@xmtp/react-sdk";
import { useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { shortAddress, truncate } from "../helpers";
import type { PeerIdentityMetadata } from "../helpers/conversation";

const useStreamAllMessages = () => {
  const { address: walletAddress } = useAccount();
  const { getCachedByTopic } = useConversation();
  const latestMsgId = useRef<string>();

  const onMessage = useCallback(
    async (message: DecodedMessage) => {
      if (
        latestMsgId.current !== message.id &&
        Notification.permission === "granted" &&
        message.senderAddress !== walletAddress &&
        document.hidden
      ) {
        // look for name in cached conversation
        const cachedConversation = await getCachedByTopic(
          message.conversation.topic,
        );
        let name: string | null = null;
        if (cachedConversation) {
          const metadata = cachedConversation.metadata
            ?.peerIdentity as PeerIdentityMetadata;
          if (metadata) {
            name = metadata.name;
          }
        }

        // eslint-disable-next-line no-new
        new Notification("XMTP", {
          body: `${
            name || shortAddress(message.senderAddress ?? "")
          }\n${truncate(message.content as string, 75)}`,
        });

        latestMsgId.current = message.id;
      }
    },
    [getCachedByTopic, walletAddress],
  );

  void _useStreamAllMessages(onMessage);
};

export default useStreamAllMessages;
