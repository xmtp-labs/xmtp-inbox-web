import {
  ChevronLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { useTranslation } from "react-i18next";
import { Avatar } from "../Avatar/Avatar";
import { classNames } from "../../../helpers";

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
    url?: string;
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
  /**
   * Is there a left icon click event that needs to be handled?
   */
  onLeftIconClick?: () => void;
}

export const AddressInput = ({
  resolvedAddress,
  subtext,
  avatarUrlProps,
  onChange,
  isError,
  onTooltipClick,
  value,
  onLeftIconClick,
}: AddressInputProps) => {
  const { t } = useTranslation();
  const subtextColor = isError ? "text-red-600" : "text-gray-500";
  return (
    <div
      className={classNames(
        !resolvedAddress?.displayAddress
          ? "bg-indigo-50 border-b border-indigo-500"
          : "border-b border-gray-200",
        "flex items-center px-2 md:px-4 py-3 border-l-0 z-10 max-md:h-fit md:max-h-sm w-full h-16",
      )}>
      <div className="max-md:w-fit md:hidden flex w-24 p-0 justify-start">
        <ChevronLeftIcon onClick={onLeftIconClick} width={24} />
      </div>
      <form
        className="flex w-full items-center"
        onSubmit={(e) => e.preventDefault()}>
        <div className="mr-2 font-bold text-sm">{t("common.input_label")}:</div>
        {resolvedAddress?.displayAddress && <Avatar {...avatarUrlProps} />}
        <div className="ml-2 md:ml-4">
          {resolvedAddress?.displayAddress ? (
            <div
              className="font-bold text-md"
              data-testid="recipient-wallet-address">
              {resolvedAddress.displayAddress}
            </div>
          ) : (
            <input
              data-testid="message-to-input"
              tabIndex={0}
              className="bg-transparent text-gray-900 px-0 h-4 m-1 ml-0 font-mono max-md:text-[16px] md:text-sm w-full leading-tight border border-2 border-transparent focus:border-transparent focus:ring-0 cursor-text"
              id="address"
              type="search"
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onChange={(e) =>
                onChange && onChange((e.target as HTMLInputElement).value)
              }
              value={value}
              aria-label={t("aria_labels.address_input") || ""}
            />
          )}
          <div
            className={classNames(
              "font-mono",
              "text-sm",
              "max-md:text-xs",
              "h-5",
              subtextColor,
            )}
            data-testid="message-to-subtext">
            {resolvedAddress?.walletAddress
              ? resolvedAddress?.walletAddress
              : subtext
              ? t(subtext)
              : ""}
          </div>
        </div>
      </form>
      {onTooltipClick && (
        <InformationCircleIcon onClick={onTooltipClick} height="24" />
      )}
    </div>
  );
};
