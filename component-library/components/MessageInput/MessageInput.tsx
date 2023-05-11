import React, { ChangeEvent, useEffect, useLayoutEffect, useRef } from "react";
import { ArrowUpIcon } from "@heroicons/react/solid";
import { IconButton } from "../IconButton/IconButton";
import { classNames } from "../../../helpers";
import { useTranslation } from "react-i18next";

interface InputProps {
  /**
   * What happens on a submit?
   */
  onSubmit?: (msg: string) => Promise<void>;
  /**
   * Is the CTA button disabled?
   */
  isDisabled?: boolean;
  /**
   * Rerender component?
   */
  recipientAddresses?: string[];
}

export const MessageInput = ({
  onSubmit,
  isDisabled,
  recipientAddresses,
}: InputProps) => {
  const { t } = useTranslation();
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState("");
  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setValue(event.target.value);
  const borderStyles =
    "border border-gray-300 focus-within:border-1 focus-within:border-indigo-600 rounded-tl-3xl rounded-bl-3xl rounded-tr-3xl";
  const textAreaStyles = `${
    textAreaRef?.current?.scrollHeight &&
    textAreaRef?.current?.scrollHeight <= 32
      ? "max-h-8"
      : "max-h-40"
  } min-h-8 outline-none border-none focus:ring-0 resize-none mx-2 p-1 w-full max-md:text-[16px] md:text-md text-gray-900`;

  useLayoutEffect(() => {
    const MIN_TEXTAREA_HEIGHT = 32;
    if (textAreaRef?.current?.value) {
      let currentScrollHeight = textAreaRef?.current.scrollHeight;
      textAreaRef.current.style.height = `${Math.max(
        currentScrollHeight,
        MIN_TEXTAREA_HEIGHT,
      )}px`;
    } else if (textAreaRef?.current) {
      textAreaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
    }
  }, [value]);

  useEffect(() => {
    textAreaRef.current?.focus();
    setValue("");
  }, [recipientAddresses]);

  return (
    <form>
      <label htmlFor="chat" className="sr-only">
        {t("messages.message_field_prompt")}
      </label>
      <div
        className={classNames(
          "flex",
          "items-center",
          "max-h-300",
          "mx-4 my-2 mb-6",
          "bg-white",
          "relative",
          "no-scrollbar",
          "z-10",
          "p-1",
          borderStyles,
        )}>
        <textarea
          autoFocus
          id="chat"
          data-testid="message-input"
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value) {
                onSubmit?.(value);

                if (recipientAddresses && recipientAddresses.length > 0) {
                  setValue("");
                }
              }
            }
          }}
          ref={textAreaRef}
          rows={1}
          className={textAreaStyles}
          placeholder={t("messages.message_field_prompt") || ""}
          value={value}
          disabled={isDisabled}
        />
        <div className="flex items-end absolute bottom-1.5 right-1">
          <IconButton
            testId="message-input-submit"
            variant="secondary"
            label={<ArrowUpIcon color="white" width="20" />}
            srText={t("aria_labels.submit_message") || ""}
            onClick={() => {
              if (value) {
                onSubmit?.(value);
                setValue("");
                textAreaRef.current?.focus();
              }
            }}
            isDisabled={
              !value ||
              isDisabled ||
              (recipientAddresses && recipientAddresses.length === 0)
            }
          />
        </div>
      </div>
    </form>
  );
};
