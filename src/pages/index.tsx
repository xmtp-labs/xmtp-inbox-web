import { useEffect, useMemo } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useClient } from "@xmtp/react-sdk";
import { useNavigate } from "react-router-dom";
import { OnboardingStep } from "../component-library/components/OnboardingStep/OnboardingStep";
import { classNames, isAppEnvDemo, wipeKeys } from "../helpers";
import useInitXmtpClient from "../hooks/useInitXmtpClient";
import useMessagePrefill from "../hooks/useMessagePrefill";
import { RecipientAddress, useXmtpStore } from "../store/xmtp";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { client, isLoading, status, setStatus, resolveCreate, resolveEnable } =
    useInitXmtpClient();
  const { reset: resetWagmi, disconnect: disconnectWagmi } = useDisconnect();
  const { disconnect: disconnectClient } = useClient();
  const { peerAddress } = useMessagePrefill();

  const setRecipientAddress = useXmtpStore((s) => s.setRecipientAddress);

  useEffect(() => {
    const routeToInbox = () => {
      if (client) {
        navigate("/inbox");
      }
    };
    routeToInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  useEffect(() => {
    if (peerAddress) {
      setRecipientAddress(peerAddress as RecipientAddress);
    }
  }, []);

  const step = useMemo(() => {
    // special demo case that will skip onboarding
    if (isAppEnvDemo()) {
      return 0;
    }

    switch (status) {
      // XMTP identity not created
      case "new":
        return 2;
      // XMTP identity created, but not enabled
      case "created":
        return 3;
      // waiting on wallet connection
      case undefined:
      default:
        return 1;
    }
  }, [status]);

  return (
    <div className={classNames("h-screen", "w-full", "overflow-auto")}>
      <OnboardingStep
        step={step}
        isLoading={isLoading}
        onConnect={openConnectModal}
        onCreate={resolveCreate}
        onEnable={resolveEnable}
        onDisconnect={() => {
          if (client) {
            void disconnectClient();
          }
          disconnectWagmi();
          setStatus(undefined);
          wipeKeys(address ?? "");
          resetWagmi();
          resetXmtpState();
        }}
      />
    </div>
  );
};

export default OnboardingPage;
