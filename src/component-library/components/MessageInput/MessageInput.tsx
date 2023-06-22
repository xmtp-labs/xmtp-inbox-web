import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Attachment } from "@xmtp/content-type-remote-attachment";
import {
  ArrowUpIcon,
  DocumentIcon,
  PhotographIcon,
  VideoCameraIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { useTranslation } from "react-i18next";
import { IconButton } from "../IconButton/IconButton";
import { useAttachmentChange } from "../../../hooks/useAttachmentChange";
import { typeLookup, type contentTypes } from "../../../helpers/attachments";
import { classNames } from "../../../helpers";
import { useXmtpStore } from "../../../store/xmtp";

interface InputProps {
  /**
   * What happens on a submit?
   */
  onSubmit?: (
    msg: string | Attachment,
    type: "attachment" | "text",
  ) => Promise<void>;
  /**
   * Is the CTA button disabled?
   */
  isDisabled?: boolean;
  /**
   * Rerender component?
   */
  conversationId?: string;
  /**
   * Content attachment
   */
  attachment?: Attachment;
  /**
   * Function to set content attachment in state to send on submit
   */
  setAttachment: (attachment: Attachment | undefined) => void;
  /**
   * What to show in the input before an attachment is sent
   */
  attachmentPreview?: string;
  /**
   * Function to set the preview of the attachment in the input
   */
  setAttachmentPreview: (url: string | undefined) => void;
  /**
   * Function to set whether content is being dragged over the draggable area, including the message input
   */
  setIsDragActive: (status: boolean) => void;
}

export const MessageInput = ({
  onSubmit,
  isDisabled,
  conversationId,
  attachment,
  setAttachment,
  attachmentPreview,
  setAttachmentPreview,
  setIsDragActive,
}: InputProps) => {
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [acceptedTypes, setAcceptedTypes]: [
    string | string[] | undefined,
    Dispatch<SetStateAction<string | string[] | undefined>>,
  ] = useState();
  const attachmentError = useXmtpStore((state) => state.attachmentError);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setValue(event.target.value);

  const textAreaStyles = `${
    textAreaRef?.current?.scrollHeight &&
    textAreaRef?.current?.scrollHeight <= 32
      ? "max-h-8"
      : "max-h-40"
  } min-h-8 outline-none border-none focus:ring-0 resize-none mx-2 p-1 w-full max-md:text-[16px] md:text-md text-gray-900`;

  useLayoutEffect(() => {
    const MIN_TEXTAREA_HEIGHT = 32;
    if (textAreaRef?.current?.value) {
      const currentScrollHeight = textAreaRef?.current.scrollHeight;
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
    setAttachmentPreview(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const onButtonClick = (contentType: contentTypes) => {
    // For document view, we want to accept all file types, even if we can't gracefully render them on the UI.
    if (contentType === "application") {
      setAcceptedTypes("all");
    } else {
      const acceptedFileTypeList = Object.keys(typeLookup).reduce(
        (acc: string[], key: string) => {
          if (typeLookup[key] === contentType) acc.push(`.${key}`);
          return acc;
        },
        [],
      );
      setAcceptedTypes([...acceptedFileTypeList]);
    }
  };

  useEffect(() => {
    if (acceptedTypes) {
      inputFile?.current?.click();
    }
  }, [acceptedTypes]);

  const { onAttachmentChange } = useAttachmentChange({
    setAttachment,
    setAttachmentPreview,
    setIsDragActive,
  });

  const extension = attachment?.mimeType.split("/")?.[1] || "";

  return (
    <form className="flex flex-col border border-gray-300 rounded-2xl m-4">
      <label htmlFor="chat" className="sr-only">
        {t("messages.message_field_prompt")}
      </label>
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={onAttachmentChange}
        aria-label={t("aria_labels.filepicker") || "File picker"}
        accept={
          Array.isArray(acceptedTypes) ? acceptedTypes.join(",") : undefined
        }
        hidden
      />
      <div
        className={classNames(
          "m-0 p-2",
          attachment ? "border-b border-gray-200" : "",
        )}>
        {attachmentError ? (
          <p className="text-red-600 w-full m-1 ml-4">{attachmentError}</p>
        ) : (
          <textarea
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            id="chat"
            data-testid="message-input"
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (value || attachment) {
                  if (attachment) {
                    void onSubmit?.(attachment, "attachment");
                    setAttachment(undefined);
                    setAttachmentPreview(undefined);
                  }
                  if (value) {
                    void onSubmit?.(value, "text");
                    setValue("");
                  }
                }
              }
            }}
            ref={textAreaRef}
            rows={1}
            className={classNames(
              textAreaStyles,
              "border-b-8 border-gray-50 m-0 bg-transparent",
            )}
            placeholder={t("messages.message_field_prompt") || ""}
            value={value}
          />
        )}
      </div>
      {attachmentPreview && (
        <div className="relative m-8 w-fit">
          {typeLookup[extension] === "video" ? (
            <video width="320" height="240" controls autoPlay>
              <source src={attachmentPreview} type="video/mp4" />
              {t("attachments.video_messages_not_supported")}
            </video>
          ) : typeLookup[extension] === "application" ? (
            <object
              data={attachmentPreview}
              type="application/pdf"
              width="100%"
              height="500px">
              <p>{t("attachments.unable_to_display")}</p>
            </object>
          ) : typeLookup[extension] === "image" ? (
            <img
              src={attachmentPreview || ""}
              alt={attachment?.filename}
              className="relative w-95/100  max-h-80 rounded-xl overflow-auto"
            />
          ) : (
            <div className="flex text-blue-600 font-bold">
              <a
                href={attachmentPreview}
                target="_blank"
                rel="noopener noreferrer">
                {attachment?.filename}
              </a>
            </div>
          )}

          <XCircleIcon
            width={20}
            fill="black"
            className="absolute -top-2 -right-2 cursor-pointer text-white"
            onClick={() => setAttachmentPreview(undefined)}
          />
        </div>
      )}
      <div className="flex justify-between bg-gray-100 rounded-b-2xl px-2">
        <div className="flex flex-row">
          <PhotographIcon
            width={24}
            height={24}
            className="m-2 cursor-pointer text-gray-400 hover:text-black"
            onClick={() => onButtonClick("image")}
          />
          <VideoCameraIcon
            width={26}
            height={26}
            className="m-2 cursor-pointer text-gray-400 hover:text-black"
            onClick={() => onButtonClick("video")}
          />
          <DocumentIcon
            width={24}
            height={24}
            className="m-2 cursor-pointer text-gray-400 hover:text-black"
            onClick={() => onButtonClick("application")}
          />
        </div>
        <div className="flex items-center">
          <IconButton
            testId="message-input-submit"
            variant="secondary"
            label={<ArrowUpIcon color="white" width="20" />}
            srText={t("aria_labels.submit_message") || ""}
            onClick={() => {
              if (value || attachment) {
                if (attachment) {
                  void onSubmit?.(attachment, "attachment");
                  setAttachment(undefined);
                  setAttachmentPreview(undefined);
                }
                if (value) {
                  void onSubmit?.(value, "text");
                  setValue("");
                }
                textAreaRef.current?.focus();
              }
            }}
            isDisabled={
              !(value || attachmentPreview) || isDisabled || !!attachmentError
            }
          />
        </div>
      </div>
    </form>
  );
};
