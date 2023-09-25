/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon, CogIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, PlusIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { classNames } from "../../../helpers";
import { IconButton } from "../IconButton/IconButton";

interface HeaderDropdownProps {
  /**
   * What options does the user have to change?
   */
  dropdownOptions?: Array<string>;
  /**
   * What is currently selected?
   */
  defaultSelected?: string;
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
  dropdownOptions,
  defaultSelected,
  onChange,
  onClick,
  disabled,
  recipientInput,
  isMobileView,
}: HeaderDropdownProps) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [currentlySelected, setCurrentlySelected] = useState(
    defaultSelected || t("messages.filter_none"),
  );

  useEffect(() => {
    setCurrentlySelected(defaultSelected || t("messages.filter_none"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  return (
    <div
      data-modal-target="headerModalId"
      data-testid="conversation-list-header"
      className="border-l border-r border-b border-gray-200 bg-gray-100 h-16 p-4 pt-5">
      <div className="flex justify-between items-center">
        <span className="flex" onClick={() => setIsOpen(!isOpen)}>
          <h1 className="font-bold text-lg mr-2">{currentlySelected}</h1>
          {!disabled && <ChevronDownIcon width="24" />}
        </span>
        {(recipientInput || isMobileView) && (
          <IconButton
            onClick={() => onClick?.()}
            label={<PlusIcon color="white" width="20" />}
            testId="new-message-icon-cta"
            srText={t("aria_labels.start_new_message") || ""}
          />
        )}
      </div>

      {!disabled && isOpen && (
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="overflow-y-auto fixed inset-0 z-10"
            onClose={() => {}}>
            <div className="bg-white w-fit rounded-lg absolute top-14 left-16">
              <div
                id="headerModalId"
                className="p-4 border border-gray-100 rounded-lg max-w-fit">
                {(
                  dropdownOptions || [
                    t("messages.filter_none"),
                    t("messages.filter_requests"),
                  ]
                ).map((item) => (
                  <div key={item} className="flex w-full justify-between">
                    <div className="flex">
                      <CogIcon width={24} className="text-gray-300 mr-4" />
                      <button
                        type="button"
                        onClick={() => {
                          onChange?.();
                          setIsOpen(false);
                          // setCurrentlySelected?.();
                        }}
                        className={classNames(
                          "cursor-pointer",
                          "my-1",
                          "outline-none",
                          item === currentlySelected ? "font-bold my-1" : "",
                        )}>
                        {item}
                      </button>
                    </div>
                    <div className="flex items-center">
                      {item === currentlySelected && (
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
