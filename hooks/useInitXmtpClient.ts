import { Client } from "@xmtp/xmtp-js";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { ReactionCodec } from "../codecs/Reaction";
import { address } from "../components/Address";
import { getAppVersion, getEnv, loadKeys, storeKeys } from "../helpers";
import { useConversationCache } from "../store/conversationCache";
import { useXmtpStore } from "../store/xmtp";

const useInitXmtpClient = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const client = useXmtpStore((state) => state.client);
  const setClient = useXmtpStore((state) => state.setClient);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const conversationExports = useConversationCache(
    (state) => state.conversations[address as address],
  );

  const initClient = async () => {
    if (signer && !client) {
      try {
        const address = await signer.getAddress();
        setIsRequestPending(true);
        let keys = loadKeys(address);
        if (!keys) {
          keys = await Client.getKeys(signer, {
            env: getEnv(),
            appVersion: getAppVersion(),
          });
          storeKeys(address, keys);
        }
        const xmtp = await Client.create(null, {
          env: getEnv(),
          appVersion: getAppVersion(),
          privateKeyOverride: keys,
          codecs: [new ReactionCodec()],
        });
        if (conversationExports && conversationExports.length) {
          // Preload the client with conversations from the cache
          await xmtp.conversations.import(conversationExports);
        }
        setClient(xmtp);
        setIsRequestPending(false);
      } catch (e) {
        console.error(e);
        setClient(null);
        setIsRequestPending(false);
      }
    }
  };

  useEffect(() => {
    if (!isRequestPending) {
      signer && initClient();
    }
  }, [signer]);

  return {
    initClient,
  };
};

export default useInitXmtpClient;
