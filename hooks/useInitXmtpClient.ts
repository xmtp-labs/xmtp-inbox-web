import { Client } from "@xmtp/xmtp-js";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { getAppVersion, getEnv, loadKeys, storeKeys } from "../helpers";
import { useConversationCache } from "../store/conversationCache";
import { useXmtpStore } from "../store/xmtp";
import { address } from "../pages/inbox";

const useInitXmtpClient = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const client = useXmtpStore((state) => state.client);
  const setClient = useXmtpStore((state) => state.setClient);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const conversationExports = useConversationCache(
    (state) => state.conversations[address as address],
  );

  const createXmtpIdentity = async () => {
    try {
      if (signer) {
        setIsLoading(true);
        const address = await signer.getAddress();
        const keys = await Client.getKeys(signer, {
          env: getEnv(),
          appVersion: getAppVersion(),
        });
        storeKeys(address, keys);
        setNewAccount(false);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setNewAccount(false);
      setIsLoading(false);
    }
  };

  const connectToXmtp = async () => {
    if (signer) {
      try {
        setIsLoading(true);
        const address = await signer.getAddress();
        setIsRequestPending(true);
        let keys = loadKeys(address);
        if (!keys) {
          await createXmtpIdentity();
          keys = loadKeys(address);
        }
        if (keys) {
          const xmtp = await Client.create(null, {
            env: getEnv(),
            appVersion: getAppVersion(),
            privateKeyOverride: keys,
          });
          setClient(xmtp);
          setIsRequestPending(false);
          setNewAccount(false);
          setIsLoading(false);
        }
        const xmtp = await Client.create(null, {
          env: getEnv(),
          appVersion: getAppVersion(),
          privateKeyOverride: keys || undefined,
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
        setIsLoading(false);
      }
    }
  };

  const initClient = async () => {
    if (signer && !client) {
      const address = await signer.getAddress();
      try {
        setIsLoading(true);
        const canMessage = await Client.canMessage(address);
        if (canMessage) {
          setNewAccount(false);
          connectToXmtp();
        } else {
          setNewAccount(true);
        }
      } catch (e) {
        console.error(e);
        setNewAccount(true);
      } finally {
        setIsLoading(false);
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
    createXmtpIdentity,
    newAccount,
    connectToXmtp,
    isLoading,
  };
};

export default useInitXmtpClient;
