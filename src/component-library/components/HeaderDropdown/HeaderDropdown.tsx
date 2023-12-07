/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  CogIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline";
import { CheckCircleIcon, PlusIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "../../../helpers";
import { IconButton } from "../IconButton/IconButton";
import { useXmtpStore } from "../../../store/xmtp";

interface HeaderDropdownProps {
  /**
   * What happens on change?
   */
  onChange?: () => void;
  /**
   * On new message button click?
   */
  onClick?: () => void;
  /**
   * Is this dropdown disabled?
   */
  disabled?: boolean;
  /**
   * What is the recipient input?
   */
  recipientInput: string;
  /**
   * Boolean to determine if screen width is mobile size
   */
  isMobileView?: boolean;
}

export const HeaderDropdown = ({
  onChange,
  onClick,
  disabled,
  recipientInput,
  isMobileView,
}: HeaderDropdownProps) => {
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeTab = useXmtpStore((s) => s.activeTab);
  const setActiveTab = useXmtpStore((s) => s.setActiveTab);

  return (
    <div
      data-modal-target="headerModalId"
      data-testid="conversation-list-header"
      className="border-l border-r border-b border-gray-200 bg-gray-100 h-16 p-4 pt-5">
      <div className="flex justify-evenly items-center">
        <h1
          id="preview-header"
          className="font-bold text-lg mr-2 cursor-pointer">
          {"Messages"}
        </h1>
        <h1
          id="preview-header"
          className="font-bold text-lg mr-2 cursor-pointer">
          {"Requests (2)"}
        </h1>
        <DotsVerticalIcon
          width="24"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        />
        {(recipientInput || isMobileView) && (
          <IconButton
            onClick={() => onClick?.()}
            label={<PlusIcon color="white" width="20" />}
            testId="new-message-icon-cta"
            srText={t("aria_labels.start_new_message") || ""}
          />
        )}
      </div>

      {isMenuOpen && (
        <Transition.Root show={isMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="overflow-y-auto fixed inset-0 z-10"
            onClose={() => {}}>
            <div className="bg-white w-fit rounded-lg absolute top-14 left-72">
              <div
                id="headerModalId"
                className="p-4 border border-gray-100 rounded-lg max-w-fit">
                {["Blocked"]?.map((item) => (
                  <div key={item} className="flex w-full justify-between">
                    <div className="flex">
                      <CogIcon width={24} className="text-gray-300 mr-4" />
                      <button
                        type="button"
                        onClick={(e) => {
                          onChange?.();
                          setIsOpen(false);
                          setActiveTab((e.target as HTMLElement).innerText);
                        }}
                        className={classNames(
                          "cursor-pointer",
                          "my-1",
                          "outline-none",
                          item === activeTab ? "font-bold my-1" : "",
                        )}>
                        {item}
                      </button>
                    </div>
                    <div className="flex items-center">
                      {item === activeTab && (
                        <CheckCircleIcon
                          fill="limegreen"
                          width="24"
                          className="ml-4"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </div>
  );
};
