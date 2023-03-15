import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useXmtpStore } from "../store/xmtp";
import { watchAccount } from "@wagmi/core";
import useInitXmtpClient from "../hooks/useInitXmtpClient";
import useHandleConnect from "../hooks/useHandleConnect";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { classNames, wipeKeys } from "../helpers";
import { OnboardingStep } from "../component-library/components/OnboardingStep/OnboardingStep";

const OnboardingPage: NextPage = () => {
  const client = useXmtpStore((state) => state.client);
  const [step, setStep] = useState(1);
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const { address, isConnecting, isDisconnected } = useAccount();
  const { handleConnect } = useHandleConnect();
  const { createXmtpIdentity, newAccount, connectToXmtp, isLoading } =
    useInitXmtpClient();
  const { disconnect: disconnectWagmi, reset: resetWagmi } = useDisconnect();

  const [loading, setLoading] = useState(isLoading);
  const router = useRouter();

  useEffect(() => {
    watchAccount(() => resetXmtpState());
  }, []);

  useEffect(() => {
    if (address && !newAccount && client) {
      router.push("/inbox");
    }
  }, [client, address, newAccount]);

  useEffect(() => {
    if (isDisconnected) {
      setStep(1);
      setLoading(false);
    } else if (isConnecting && !isDisconnected) {
      setStep(1);
      setLoading(true);
    } else if (newAccount && !client) {
      setStep(2);
    } else {
      setStep(3);
    }
  }, [client, isConnecting, isDisconnected, newAccount]);

  return (
    <div
      className={classNames("bg-white", "h-screen", "w-full", "overflow-auto")}>
      {!address && !client && (
        <div
          className="flex justify-end text-sm font-bold text-p-500 underline cursor-pointer absolute right-4 top-4"
          onClick={() => {
            window.open("https://demo.xmtp.chat", "_blank");
          }}>
          Try a demo
        </div>
      )}
      <OnboardingStep
        step={step}
        isLoading={isLoading}
        onConnect={handleConnect}
        onCreate={createXmtpIdentity}
        onEnable={connectToXmtp}
        onDisconnect={() => {
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
