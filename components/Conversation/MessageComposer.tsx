import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Attachment } from "xmtp-content-type-remote-attachment";
import { classNames } from "../../helpers";
import messageComposerStyles from "../../styles/MessageComposer.module.css";
import upArrowGreen from "../../public/up-arrow-green.svg";
import upArrowGrey from "../../public/up-arrow-grey.svg";
import Image from "next/image";
import { useXmtpStore } from "../../store/xmtp";
import AttachmentPreviewView from "./AttachmentPreviewView";

type MessageComposerProps = {
  onSend: (msg: string) => Promise<void>;
  attachment?: Attachment;
  setAttachment: React.Dispatch<React.SetStateAction<Attachment | undefined>>;
};

const MessageComposer = ({
  onSend,
  attachment,
  setAttachment,
}: MessageComposerProps): JSX.Element => {
  const [message, setMessage] = useState("");
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );

  useEffect(() => setMessage(""), [recipientWalletAddress]);

  const onMessageChange = (e: React.FormEvent<HTMLInputElement>) =>
    setMessage(e.currentTarget.value);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message && !attachment) {
      return;
    }
    setMessage("");
    setAttachment(undefined);
    await onSend(message);
  };

  function onKeyDown() {}

  return (
    <div
      className={classNames("flex", "items-center", "block", "md:pl-84")}
      style={{
        position: "absolute",
        bottom: "0px",
        right: "0px",
        left: "0px",
      }}>
      <form
        className={classNames(
          "m-2",
          "grow",
          "flex-1",
          "border",
          "py-2",
          "pl-4",
          "mr-3",
          "drop-shadow-xl",
          "mt-0",
          messageComposerStyles.bubble,
        )}
        autoComplete="off"
        onSubmit={onSubmit}>
        {attachment && <AttachmentPreviewView attachment={attachment} />}
        <div className="flex">
          <input
            type="text"
            placeholder="Type something..."
            className={classNames(
              "block",
              "w-full",
              "text-md",
              "md:text-sm",

              messageComposerStyles.input,
            )}
            name="message"
            value={message}
            onKeyDown={onKeyDown}
            onChange={onMessageChange}
            required={!attachment}
            data-testid="message-input"
          />
          <button
            type="submit"
            className={messageComposerStyles.arrow}
            data-testid="message-input-submit">
            {!(message || attachment) ? (
              <Image src={upArrowGrey} alt="send" height={32} width={32} />
            ) : (
              <Image src={upArrowGreen} alt="send" height={32} width={32} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer;
