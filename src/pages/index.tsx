import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useClient } from "@xmtp/react-sdk";
import { useNavigate } from "react-router-dom";
import { OnboardingStep } from "../component-library/components/OnboardingStep/OnboardingStep";
import { classNames, isAppEnvDemo, wipeKeys } from "../helpers";
import useInitXmtpClient from "../hooks/useInitXmtpClient";
import { useXmtpStore } from "../store/xmtp";
import useInitMetamaskClient from "../hooks/useInitMetamaskClient";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [isSnapsFlow, setIsSnapsFlow] = useState(false);
  const { client, isLoading, status, setStatus, resolveCreate, resolveEnable } =
    useInitXmtpClient({ shouldRun: isSnapsFlow });

  const {
    client: metamaskClient,
    isLoading: metamaskLoading,
    status: metamaskStatus,
    setStatus: setMetamaskStatus,
    resolveCreate: metamaskResolveCreate,
    resolveEnable: metamaskResolveEnable,
  } = useInitMetamaskClient({
    shouldRun: isSnapsFlow,
    onFail: () => setIsSnapsFlow(false),
  });
  const { disconnect: disconnectWagmi, reset: resetWagmi } = useDisconnect();
  const { disconnect: disconnectClient } = useClient();

  useEffect(() => {
    if (window.ethereum?.isMetaMask) {
      setIsSnapsFlow(true);
    }
  }, []);
  useEffect(() => {
    const routeToInbox = () => {
      if (client || metamaskClient) {
        navigate("/inbox");
      }
    };
    routeToInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, metamaskClient]);

  const step = useMemo(() => {
    // special demo case that will skip onboarding
    if (isAppEnvDemo()) {
      return 0;
    }
    switch (status || metamaskStatus) {
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
  }, [status, metamaskStatus]);

  return (
    <div className={classNames("h-screen", "w-full", "overflow-auto")}>
      <OnboardingStep
        step={step}
        isLoading={isLoading || metamaskLoading}
        onConnect={openConnectModal}
        onCreate={resolveCreate || metamaskResolveCreate}
        onEnable={resolveEnable || metamaskResolveEnable}
        onDisconnect={() => {
          if (client || metamaskClient) {
            void disconnectClient();
          }
          setStatus(undefined);
          setMetamaskStatus(undefined);
          wipeKeys(address ?? "");
          disconnectWagmi();
          resetWagmi();
          resetXmtpState();
        }}
      />
    </div>
  );
};

export default OnboardingPage;
