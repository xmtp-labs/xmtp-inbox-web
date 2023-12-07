import {
  useStreamAllMessages as _useStreamAllMessages,
  useConversation,
  useStreamConsentList,
} from "@xmtp/react-sdk";
import type { DecodedMessage } from "@xmtp/react-sdk";
import { useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { shortAddress, truncate } from "../helpers";
import { getCachedPeerAddressName } from "../helpers/conversation";

const useStreamAllMessages = () => {
  const { address: walletAddress } = useAccount();
  const { getCachedByTopic } = useConversation();
  const latestMsgId = useRef<string>();

  const onMessage = useCallback(
    async (message: DecodedMessage) => {
      if (
        latestMsgId.current !== message.id &&
        "Notification" in window &&
        window.Notification.permission === "granted" &&
        message.senderAddress !== walletAddress &&
        document.hidden
      ) {
        // look for name in cached conversation
        const cachedConversation = await getCachedByTopic(
          message.conversation.topic,
        );

        if (cachedConversation) {
          const name = getCachedPeerAddressName(cachedConversation);

          // eslint-disable-next-line no-new
          new window.Notification("XMTP", {
            body: `${
              name || shortAddress(message.senderAddress ?? "")
            }\n${truncate(message.content as string, 75)}`,
          });
        }

        latestMsgId.current = message.id;
      }
    },
    [getCachedByTopic, walletAddress],
  );

  void _useStreamAllMessages(onMessage);
  void useStreamConsentList();
};

export default useStreamAllMessages;
