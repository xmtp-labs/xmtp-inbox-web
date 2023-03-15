import { DecodedMessage } from "@xmtp/xmtp-js";
import { useEffect, useState } from "react";
import { getConversationId, shortAddress, truncate } from "../helpers";
import { useXmtpStore } from "../store/xmtp";
import { fetchEnsName } from "@wagmi/core";
import { useAccount } from "wagmi";
import { address } from "../pages/inbox";

let latestMsgId: string;

export const useStreamAllMessages = () => {
  const { address: walletAddress } = useAccount();

  const client = useXmtpStore((state) => state.client);

  const convoMessages = useXmtpStore((state) => state.convoMessages);
  const addMessages = useXmtpStore((state) => state.addMessages);
  const setPreviewMessage = useXmtpStore((state) => state.setPreviewMessage);
  const [browserVisible, setBrowserVisible] = useState<boolean>(true);

  useEffect(() => {
    window.addEventListener("focus", () => setBrowserVisible(true));
    window.addEventListener("blur", () => setBrowserVisible(false));
  }, []);

  useEffect(() => {
    if (!client) {
      return;
    }

    let messageStream: AsyncGenerator<DecodedMessage>;

    const streamAllMessages = async () => {
      messageStream = await client?.conversations?.streamAllMessages();

      for await (const message of messageStream) {
        const key = getConversationId(message.conversation);
        setPreviewMessage(key, message);

        const numAdded = addMessages(key, [message]);
        if (numAdded > 0) {
          const newMessages = convoMessages.get(key) ?? [];
          newMessages.push(message);
          // Below code is to remove duplicate messages from the
          // newMessages array
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item["id"], item])).values(),
            ),
          ];
          convoMessages.set(key, uniqueMessages);
          if (
            latestMsgId !== message.id &&
            Notification.permission === "granted" &&
            message.senderAddress !== walletAddress &&
            !browserVisible
          ) {
            const name = await fetchEnsName({
              address: message.senderAddress as address,
            });
            new Notification("XMTP", {
              body: `${
                name || shortAddress(message.senderAddress ?? "")
              }\n${truncate(message.content, 75)}`,
            });

            latestMsgId = message.id;
          }
        }
      }
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined);
      }
    };

    streamAllMessages();

    return () => {
      closeMessageStream();
    };
  }, [client, walletAddress]);
};

export default useStreamAllMessages;
