import React from "react";
import { Spinner } from "../Loaders/Spinner";
import stepMapping, { ctaStep } from "./stepMapping";
import { GhostButton } from "../GhostButton/GhostButton";
import { DisconnectIcon } from "../Icons/DisconnectIcon";
import { logoSvg as Logo } from "./logo";
import { PillButton } from "../PillButton/PillButton";

interface OnboardingStepProps {
  /**
   * What step in the process is this?
   */
  step: number;
  /**
   * Is the message content loading?
   */
  isLoading?: boolean;
  /**
   * What function should be run to connect to a wallet?
   */
  onConnect?: () => void;
  /**
   * What function should be run to create an XMTP identity?
   */
  onCreate?: () => void;
  /**
   * What function should be run to enable an XMTP identity?
   */
  onEnable?: () => void;
  /**
   * What function should be run to disconnect a wallet?
   */
  onDisconnect?: () => void;
}

export const OnboardingStep = ({
  step,
  isLoading,
  onConnect,
  onCreate,
  onEnable,
  onDisconnect,
}: OnboardingStepProps) => {
  const stepInfo = isLoading
    ? stepMapping[step]?.loading
    : stepMapping[step]?.default;

  if (stepInfo) {
    const { header, subheader, cta, subtext } = stepInfo;

    return (
      <div className="bg-white flex flex-col justify-center items-center max-w-sm text-center m-auto w-screen p-4 h-full">
        {isLoading ? (
          <Spinner />
        ) : (
          <div data-testid="xmtp-logo" className="h-1/2">
            <Logo />
          </div>
        )}
        <div className="h-1/2">
          <p className="pt-4">{step > 1 ? `Step ${step - 1} of 2` : null}</p>
          <h1
            className="text-4xl font-bold p-4"
            data-testid={step === 1 && "no-wallet-connected-header"}>
            {header}
          </h1>
          <p data-testid={step === 1 && "no-wallet-connected-subheader"}>
            {subheader}
          </p>
          <div className="p-4">
            {cta === ctaStep.ENABLE ? (
              <PillButton
                label="Enable XMTP identity"
                onClick={onEnable}
                testId="enable-xmtp-identity-cta"
              />
            ) : cta === ctaStep.CREATE ? (
              <PillButton
                label="Create XMTP identity"
                onClick={onCreate}
                testId="create-xmtp-identity-cta"
              />
            ) : cta === ctaStep.CONNECT ? (
              <PillButton
                label="Connect your wallet"
                onClick={onConnect}
                testId="no-wallet-connected-cta"
              />
            ) : null}
          </div>
          {subtext ? (
            <p
              className="font-bold text-md text-gray-500"
              data-testid={step === 1 && "no-wallet-connected-subtext"}>
              {subtext}
            </p>
          ) : (
            <GhostButton
              onClick={onDisconnect}
              label="Disconnect Wallet"
              variant="secondary"
              icon={<DisconnectIcon />}
            />
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
