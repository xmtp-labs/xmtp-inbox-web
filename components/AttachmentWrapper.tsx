import { PropsWithChildren } from "react";
import type { Attachment } from "xmtp-content-type-remote-attachment";
import React, { useState, useRef, useLayoutEffect } from "react";

type AttachmentWrapperProps = {
  attachment?: Attachment;
  setAttachment: React.Dispatch<React.SetStateAction<Attachment | undefined>>;
};

const AttachmentWrapper = (
  props: PropsWithChildren<AttachmentWrapperProps>,
): JSX.Element => {
  const [isDragActive, setIsDragActive] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (bottomRef.current instanceof HTMLInputElement) {
      if (bottomRef.current.parentNode instanceof HTMLElement) {
        bottomRef.current.parentNode.scrollTop = 10000000;
      }
    }
  }, [props.attachment]);

  // handle drag events
  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = async function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      console.log("got a file", file);

      let data: ArrayBuffer;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", async function (e: ProgressEvent) {
        const data = fileReader.result;
        console.log("load called", data);

        if (!(data instanceof ArrayBuffer)) {
          console.log("no data");
          return;
        }

        const attachment: Attachment = {
          filename: file.name,
          mimeType: file.type,
          data: new Uint8Array(data),
        };

        props.setAttachment(attachment);
      });

      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <div
      ref={bottomRef}
      className={isDragActive ? "bg-blue" : ""}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}>
      {props.children}
      {isDragActive && (
        <p className="absolute" style={{ bottom: "50%", left: "50%" }}>
          Drop it.
        </p>
      )}
      <span ref={bottomRef}></span>
    </div>
  );
};

export default AttachmentWrapper;
