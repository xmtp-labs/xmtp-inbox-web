import { ChevronRightIcon } from "@heroicons/react/outline";
import React from "react";
import { classNames } from "../../../helpers";
import { ShortCopySkeletonLoader } from "../Loaders/SkeletonLoaders/ShortCopySkeletonLoader";
import { IconSkeletonLoader } from "../Loaders/SkeletonLoaders/IconSkeletonLoader";
import { iconMapping, InfoCardIcon } from "./iconMapping";

interface InfoCardProps {
  /**
   * What is the header text?
   */
  header: string;
  /**
   * What is the optional subtext?
   */
  subtext?: string;
  /**
   * What enum for the left icon should we use to map to its corresponding icon?
   */
  leftIcon?: InfoCardIcon;
  /**
   * Are we waiting on anything loading?
   */
  isLoading?: boolean;
  /**
   * What is the click event?
   */
  onClick?: () => void;
  /**
   * Are there additional styles?
   */
  styles?: string;
  /**
   * What is the test id for this card?
   */
  testId?: string;
  /**
   * What url should we redirect to?
   */
  url?: string;
}

/**
 *
 * Gets the mapped background of the SVG on the left icon
 */
const getLeftIconBackground = (leftIcon?: InfoCardIcon) =>
  leftIcon ? iconMapping[leftIcon]?.backgroundColor : "";

/**
 *
 * Gets the mapped icon SVG to render
 */
const getLeftIcon = (leftIcon?: InfoCardIcon) =>
  leftIcon ? iconMapping[leftIcon]?.icon : "";
/**
 *
 * Multi-line info card with icon component
 */
export const InfoCard = ({
  header,
  subtext,
  leftIcon,
  isLoading = false,
  onClick = undefined,
  styles,
  testId,
  url,
}: InfoCardProps) => {
  return (
    <div
      className={classNames(
        "w-full",
        "flex",
        "py-2",
        "px-4",
        "flex",
        "items-center",
        "justify-between",
        "border-y",
        "border-gray-300",
        "cursor-pointer",
        styles || null,
      )}>
      {isLoading ? (
        <ShortCopySkeletonLoader lines={2} />
      ) : (
        <a
          href={url}
          target="blank"
          className="flex"
          onClick={onClick}
          data-testid={`${testId}-section-link`}>
          <div
            className={classNames(
              getLeftIconBackground(leftIcon),
              "p-2",
              "mr-4",
              "rounded-md",
              "h-fit",
            )}
            data-testid={`${testId}-icon`}>
            {getLeftIcon(leftIcon)}
          </div>
          <div className="flex flex-col">
            <div className="font-bold" data-testid={`${testId}-header`}>
              {header}
            </div>
            <p
              className="text-gray-400 text-md"
              data-testid={`${testId}-subheader`}>
              {subtext}
            </p>
          </div>
        </a>
      )}
      <div>
        {isLoading && onClick ? (
          <IconSkeletonLoader />
        ) : (
          (onClick || url) && (
            <ChevronRightIcon
              width="24"
              color="gray"
              className="ml-4"
              data-testid={`${testId}-arrow`}
            />
          )
        )}
      </div>
    </div>
  );
};
