import { Client, ContentTypeId } from '@xmtp/xmtp-js';
import { Signer } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { getAppVersion, getEnv, loadKeys, storeKeys, wipeKeys } from '../helpers';
import { useAppStore } from '../store/app';
import { useXmtpStore } from '../store/xmtp';

const useInitXmtpClient = (cacheOnly = false) => {
  const signer = useAppStore((state) => state.signer);
  const address = useAppStore((state) => state.address) ?? '';
  const client = useAppStore((state) => state.client);
  const setClient = useAppStore((state) => state.setClient);
  const resetAppState = useAppStore((state) => state.resetAppState);
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const disconnect = () => {
    resetAppState();
    resetXmtpState();
    if (signer) {
      wipeKeys(address);
    }
  };

  const ContentTypeAudioeKey = new ContentTypeId({
    authorityId: 'xmtp.test',
    typeId: 'audio-key',
    versionMajor: 1,
    versionMinor: 0,
  })

  class VoiceCodec {
    get contentType() {
      return ContentTypeAudioeKey;
    }

    encode(key: string | undefined) {
      return {
        type: ContentTypeAudioeKey,
        parameters: {},
        content: new TextEncoder().encode(key)
      };
    }

    decode(content: { content: any }) {
      const uint8Array = content.content;
      const key = new TextDecoder().decode(uint8Array);
      return key;
    }
  }

  const initClient = useCallback(
    async (wallet: Signer) => {
      if (wallet && !client && address) {
        try {
          setIsRequestPending(true);
          let keys = loadKeys(address);
          if (!keys) {
            if (cacheOnly) {
              return;
            }
            keys = await Client.getKeys(wallet, {
              env: 'production',
              appVersion: getAppVersion()
            });
            storeKeys(address, keys);
          }
          const xmtp = await Client.create(null, {
            env: 'production',
            appVersion: getAppVersion(),
            privateKeyOverride: keys,
            codecs: [new VoiceCodec()]
          });
          setClient(xmtp);
          setIsRequestPending(false);
        } catch (e) {
          console.error(e);
          setClient(null);
          setIsRequestPending(false);
        }
      }
    },
    [client, address]
  );

  useEffect(() => {
    if (!isRequestPending) {
      signer ? initClient(signer) : disconnect();
    }
  }, [signer, initClient, address]);

  return {
    initClient
  };
};

export default useInitXmtpClient;
