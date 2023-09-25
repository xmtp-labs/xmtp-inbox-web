import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Attachment } from "@xmtp/content-type-remote-attachment";
import {
  ArrowUpIcon,
  DocumentIcon,
  MicrophoneIcon,
  PhotographIcon,
  StopIcon,
  VideoCameraIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import {
  useConversation,
  type CachedConversation,
  type useStartConversation,
} from "@xmtp/react-sdk";
import { IconButton } from "../IconButton/IconButton";
import { useAttachmentChange } from "../../../hooks/useAttachmentChange";
import { typeLookup, type contentTypes } from "../../../helpers/attachments";
import { classNames } from "../../../helpers";
import type { RecipientAddress } from "../../../store/xmtp";
import { useXmtpStore } from "../../../store/xmtp";
import { useVoiceRecording } from "../../../hooks/useVoiceRecording";
import { useRecordingTimer } from "../../../hooks/useRecordingTimer";
import "react-tooltip/dist/react-tooltip.css";

type InputProps = {
  /**
   * What happens on a submit?
   */
  sendMessage: (
    conversation: CachedConversation,
    msg: string | Attachment,
    type: "attachment" | "text",
  ) => Promise<void>;
  startConversation: ReturnType<
    typeof useStartConversation
  >["startConversation"];
  peerAddress: RecipientAddress;
  /**
   * Is the CTA button disabled?
   */
  isDisabled?: boolean;
  /**
   * Rerender component?
   */
  conversation?: CachedConversation;
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
};

export const MessageInput = ({
  sendMessage,
  startConversation,
  peerAddress,
  isDisabled,
  conversation,
  attachment,
  setAttachment,
  attachmentPreview,
  setAttachmentPreview,
  setIsDragActive,
}: InputProps) => {
  const { getCachedByPeerAddress } = useConversation();
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [acceptedTypes, setAcceptedTypes]: [
    string | string[] | undefined,
    Dispatch<SetStateAction<string | string[] | undefined>>,
  ] = useState();
  const attachmentError = useXmtpStore((state) => state.attachmentError);
  const setConversationTopic = useXmtpStore(
    (state) => state.setConversationTopic,
  );
  const conversationTopic = useXmtpStore((state) => state.conversationTopic);

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
    if (conversationTopic) {
      textAreaRef.current?.focus();
    }
    setValue("");
    setAttachmentPreview(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

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

  // For attachments from file reader
  const { onAttachmentChange } = useAttachmentChange({
    setAttachment,
    setAttachmentPreview,
    setIsDragActive,
  });

  // For voice recording
  const { status, startRecording, stopRecording, mediaBlobUrl, error } =
    useVoiceRecording({
      setAttachment,
      setAttachmentPreview,
    });

  const { start, pause, reset, recordingValue } = useRecordingTimer({
    stopRecording,
    status,
  });

  const send = useCallback(async () => {
    // the peerAddress check is for the type checker only
    // it's not possible to send a message without a valid peerAddress
    if (peerAddress && (value || attachment)) {
      // save reference to these values before clearing them from state
      const val = value;
      const attach = attachment;

      setValue("");
      setAttachment(undefined);
      setAttachmentPreview(undefined);

      let convo = conversation;
      if (!convo) {
        // check for cached conversation with the same peer address
        const existing = await getCachedByPeerAddress(peerAddress);
        if (existing) {
          convo = existing;
        } else {
          // create new conversation
          const { cachedConversation } = await startConversation(
            peerAddress,
            undefined,
          );
          convo = cachedConversation;
        }
        // select existing or new conversation
        if (convo) {
          setConversationTopic(convo.topic);
        }
      }
      if (attach && convo) {
        void sendMessage(convo, attach, "attachment");
      }
      if (val && convo) {
        void sendMessage(convo, val, "text");
      }
      // focus on message input after sending
      textAreaRef.current?.focus();
    }
  }, [
    attachment,
    conversation,
    getCachedByPeerAddress,
    peerAddress,
    sendMessage,
    setAttachment,
    setAttachmentPreview,
    setConversationTopic,
    startConversation,
    value,
  ]);

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
          status === "recording" ? "bg-red-100 text-red-600 rounded-t-2xl" : "",
        )}>
        {attachmentError ? (
          <p className="text-red-600 w-full m-1 ml-4">{attachmentError}</p>
        ) : (
          <textarea
            id="chat"
            data-testid="message-input"
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            ref={textAreaRef}
            rows={1}
            className={classNames(
              textAreaStyles,
              "border-b-8 border-gray-50 m-0 bg-transparent",
              recordingValue && "text-red-500",
            )}
            placeholder={t("messages.message_field_prompt") || ""}
            value={recordingValue || value}
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
          ) : typeLookup[extension] === "audio" ? (
            <audio controls src={mediaBlobUrl}>
              <a href={mediaBlobUrl}>{t("attachments.unable_to_display")}</a>
            </audio>
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
            onClick={() => {
              setAttachmentPreview(undefined);
              setAttachment(undefined);
            }}
          />
        </div>
      )}
      <div className="flex justify-between bg-gray-100 rounded-b-2xl px-2">
        <div className="flex flex-row">
          <PhotographIcon
            tabIndex={0}
            width={24}
            height={24}
            className="m-2 cursor-pointer text-gray-400 hover:text-black focus:outline-none focus-visible:ring"
            onClick={() => onButtonClick("image")}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && onButtonClick("image")
            }
          />
          <VideoCameraIcon
            tabIndex={0}
            width={26}
            height={26}
            className="m-2 cursor-pointer text-gray-400 hover:text-black focus:outline-none focus-visible:ring"
            onClick={() => onButtonClick("video")}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && onButtonClick("video")
            }
          />
          <DocumentIcon
            tabIndex={0}
            width={24}
            height={24}
            className="m-2 cursor-pointer text-gray-400 hover:text-black focus:outline-none focus-visible:ring"
            onClick={() => onButtonClick("application")}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && onButtonClick("application")
            }
          />
          {status !== "recording" ? (
            <>
              <MicrophoneIcon
                data-tooltip-id="mic"
                tabIndex={0}
                width={24}
                height={24}
                className="m-2 cursor-pointer text-gray-400 hover:text-black focus:outline-none focus-visible:ring"
                onClick={() => {
                  startRecording();
                  start();
                }}
              />
              {error === "permission_denied" ? (
                <Tooltip id="mic">
                  {t("status_messaging.microphone_not_enabled")}
                </Tooltip>
              ) : null}
            </>
          ) : (
            <StopIcon
              tabIndex={0}
              id="mic"
              width={24}
              height={24}
              className="m-2 cursor-pointer text-gray-400 hover:text-black focus:outline-none focus-visible:ring"
              onClick={() => {
                stopRecording();
                pause();
                reset();
              }}
            />
          )}
        </div>
        <div className="flex items-center">
          <IconButton
            testId="message-input-submit"
            variant="secondary"
            label={<ArrowUpIcon color="white" width="20" />}
            srText={t("aria_labels.submit_message") || ""}
            onClick={() => {
              void send();
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
