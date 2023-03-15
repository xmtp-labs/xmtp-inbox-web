import React, { ChangeEvent, useLayoutEffect, useRef } from "react";
import { ArrowUpIcon } from "@heroicons/react/solid";
import { IconButton } from "../IconButton/IconButton";
import { classNames } from "../../../helpers";

interface InputProps {
  /**
   * What happens on a submit?
   */
  onSubmit?: (msg: string) => Promise<void>;
  /**
   * Is the CTA button disabled?
   */
  isDisabled?: boolean;
}

export const MessageInput = ({ onSubmit, isDisabled }: InputProps) => {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState("");
  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setValue(event.target.value);
  const borderStyles =
    "border border-gray-300 focus-within:border-1 focus-within:border-indigo-600 rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl";
  const textAreaStyles = `${
    textAreaRef?.current?.scrollHeight &&
    textAreaRef?.current?.scrollHeight <= 32
      ? "max-h-8"
      : "max-h-40"
  } min-h-8 outline-none border-none focus:ring-0 resize-none mr-0 mx-4 p-1 w-full text-md text-gray-900`;

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

  return (
    <form>
      <label htmlFor="chat" className="sr-only">
        Type something...
      </label>
      <div
        className={classNames(
          "flex",
          value ? "items-end" : "items-center",
          "max-h-300",
          "m-4",
          borderStyles,
        )}>
        <textarea
          id="chat"
          data-testid="message-input"
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value) {
                onSubmit?.(value);
                setValue("");
              }
            }
          }}
          ref={textAreaRef}
          rows={1}
          className={textAreaStyles}
          placeholder="Type something..."
          value={value}
          disabled={isDisabled}
        />
        <div className="flex items-center p-1">
          <IconButton
            testId="message-input-submit"
            variant="secondary"
            label={<ArrowUpIcon color="white" width="12" />}
            srText="Submit Message"
            onClick={() => {
              if (value) {
                onSubmit?.(value);
                setValue("");
              }
            }}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </form>
  );
};
