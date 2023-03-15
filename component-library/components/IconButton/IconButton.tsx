import React from "react";
import { ButtonLoader } from "../Loaders/ButtonLoader";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { classNames } from "../../../helpers";

interface IconButtonProps {
  /**
   * What are the button contents?
   */
  label: React.ReactNode;
  /**
   * Is this a round or message shape of the button?
   */
  variant?: "primary" | "secondary";
  /**
   * How large is this button?
   */
  size?: "small" | "large";
  /**
   * Should the button display a loading state?
   */
  isLoading?: boolean;
  /**
   * Should the button be disabled?
   */
  isDisabled?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * What should the screen reader text show?
   */
  srText?: string;
  /**
   * What is the test id associated with this button?
   */
  testId?: string;
}

const colorClassMapping = {
  primary: {
    backgroundColor:
      "bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-800",
    fontColor: null,
  },
  secondary: null,
};

const sizeClassMapping = {
  large: "text-lg p-0",
  small: "text-sm p-0",
};

/**
 * Icon-only button component
 */
export const IconButton = ({
  label = <PlusCircleIcon width="24" color="white" />,
  variant = "primary",
  isLoading = false,
  isDisabled = false,
  size = "large",
  srText,
  onClick,
  testId,
}: IconButtonProps) => {
  const disabled = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  const sizeClass = sizeClassMapping[size];
  const shape =
    variant === "primary"
      ? "rounded-full"
      : "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl";

  return (
    <button
      data-testid={testId}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        colorClassMapping.primary.backgroundColor,
        sizeClass,
        disabled,
        shape,
        "flex",
        "justify-center",
        "items-center",
        "p-0",
        "h-fit",
      )}
      aria-label={srText}>
      <>
        <div
          className={classNames(
            "bg-indigo-600",
            "hover:bg-indigo-800",
            size === "small" ? "p-1 min-h-20" : "p-2 min-h-24",
            shape,
          )}>
          {isLoading ? <ButtonLoader color={"primary"} size={size} /> : label}
        </div>
      </>
    </button>
  );
};
