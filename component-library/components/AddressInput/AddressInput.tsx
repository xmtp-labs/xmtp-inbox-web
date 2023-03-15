import React from "react";
import { Avatar } from "../Avatar/Avatar";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { classNames } from "../../../helpers";
import { ShortCopySkeletonLoader } from "../Loaders/SkeletonLoaders/ShortCopySkeletonLoader";

interface AddressInputProps {
  /**
   * What, if any, resolved address is there?
   */
  resolvedAddress?: {
    displayAddress: string;
    walletAddress?: string;
  };
  /**
   * What, if any, subtext is there?
   */
  subtext?: string;
  /**
   * What are the props associated with the avatar?
   */
  avatarUrlProps?: {
    // What is the avatar url?
    avatarUrl?: string;
    // Is the avatar url loading?
    isLoading?: boolean;
    // What's the address of this wallet?
    address?: string;
  };
  /**
   * What happens on a submit?
   */
  onChange?: (value: string) => void;
  /**
   * Upon submit, has there been an error?
   */
  isError?: boolean;
  /**
   * Upon submit, is something loading?
   */
  isLoading?: boolean;
  /**
   * Is there a tooltip click event that needs to be handled?
   */
  onTooltipClick?: () => void;
  /**
   * Input Value
   */
  value?: string;
}

export const AddressInput = ({
  resolvedAddress,
  subtext,
  avatarUrlProps,
  onChange,
  isError,
  isLoading,
  onTooltipClick,
  value,
}: AddressInputProps) => {
  const subtextColor = isError ? "text-red-400" : "text-gray-400";
  return (
    <div className="flex px-4 py-3 border border-gray-100 border-l-0 z-10 max-h-sm w-full">
      <form
        className="flex w-full items-center"
        onSubmit={(e) => e.preventDefault()}>
        <Avatar {...avatarUrlProps} />
        <div className="ml-4 flex flex-col justify-center">
          {isLoading ? (
            <ShortCopySkeletonLoader lines={1} />
          ) : resolvedAddress?.displayAddress ? (
            <div className="flex flex-col text-md">
              <span
                className="font-bold h-4 m-1 ml-0"
                data-testid="recipient-wallet-address">
                {resolvedAddress.displayAddress}
              </span>
              {resolvedAddress.walletAddress && (
                <span className="text-sm font-mono">
                  {resolvedAddress.walletAddress}
                </span>
              )}
            </div>
          ) : (
            <input
              data-testid="message-to-input"
              className="text-gray-700 px-0 h-4 m-1 font-mono text-sm w-full leading-tight border-none focus:ring-0 cursor-text"
              id="address"
              type="text"
              spellCheck="false"
              autoComplete="false"
              autoCorrect="false"
              autoCapitalize="off"
              onChange={(e) =>
                onChange && onChange((e.target as HTMLInputElement).value)
              }
              value={value}
            />
          )}
          <p
            className={classNames("font-mono", "text-sm", subtextColor)}
            data-testid="message-to-subtext">
            {subtext}
          </p>
        </div>
      </form>
      {onTooltipClick && (
        <InformationCircleIcon onClick={onTooltipClick} height="24" />
      )}
    </div>
  );
};
