import React from "react";
import { ButtonLoader } from "../Loaders/ButtonLoader";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import { classNames } from "../../../helpers";

interface PillButtonProps {
  /**
   * What are the button contents?
   */
  label: React.ReactNode;
  /**
   * What color scheme is this button?
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
   * Is there an icon that should override the default icon?
   */
  iconOverride?: React.ReactNode;
  /**
   * What is the test id?
   */
  testId?: React.ReactNode;
}

const colorClassMapping = {
  primary: {
    backgroundColor:
      "bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-800",
    fontColor: "text-white",
  },
  secondary: {
    backgroundColor:
      "bg-red-600 hover:bg-red-800 focus:outline-none focus:ring focus:ring-red-800",
    fontColor: "text-white",
  },
};

const sizeClassMapping = {
  large: "text-lg h-12 px-6 py-4",
  small: "text-sm h-8 px-4 py-2",
};

/**
 * Pill button component with text
 */

export const PillButton = ({
  label,
  variant = "primary",
  isLoading = false,
  isDisabled = false,
  size = "large",
  srText = "",
  onClick,
  iconOverride,
  testId,
}: PillButtonProps) => {
  const disabled = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  const sizeClass = sizeClassMapping[size];

  const { backgroundColor, fontColor } =
    variant === "primary"
      ? colorClassMapping.primary
      : colorClassMapping.secondary;

  const minWidth = size === "large" ? 25 : 20;

  return (
    <button
      data-testid={testId}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        backgroundColor,
        fontColor,
        disabled,
        sizeClass,
        `min-w-[${minWidth}%]`,
        "h-fit",
        "font-bold",
        "rounded-full ",
        "m-4",
      )}
      aria-label={srText}>
      <>
        <div className="flex justify-center items-center h-fit space-x-1">
          <div>{label}</div>
          {isLoading ? (
            <ButtonLoader color={"primary"} size={size} />
          ) : (
            iconOverride || (
              <ArrowCircleRightIcon width={size === "large" ? 24 : 16} />
            )
          )}
        </div>
      </>
    </button>
  );
};
