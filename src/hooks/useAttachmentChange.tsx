import type { ChangeEvent } from "react";
import { useCallback } from "react";
import type { Attachment } from "@xmtp/content-type-remote-attachment";
import { useTranslation } from "react-i18next";
import { humanFileSize } from "../helpers/attachments";
import { ATTACHMENT_ERRORS } from "../helpers";
import { useXmtpStore } from "../store/xmtp";

interface useAttachmentChangeProps {
  setAttachment: (attachment: Attachment | undefined) => void;
  setAttachmentPreview: (url: string | undefined) => void;
  setIsDragActive: (status: boolean) => void;
}

export const useAttachmentChange = ({
  setAttachment,
  setAttachmentPreview,
  setIsDragActive,
}: useAttachmentChangeProps) => {
  const { t } = useTranslation();
  const setAttachmentError = useXmtpStore((state) => state.setAttachmentError);
  const onAttachmentChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setAttachmentError("");

      // Both types needed for drag events or upload events
      const target = (e as ChangeEvent<HTMLInputElement>)?.target.files
        ? (e as ChangeEvent<HTMLInputElement>)?.target
        : (e as React.DragEvent<HTMLDivElement>)?.dataTransfer.files
        ? (e as React.DragEvent<HTMLDivElement>).dataTransfer
        : undefined;

      if (target?.files?.length && setAttachment) {
        const file = target.files[0];

        // Displays error if > 5 MB
        if (humanFileSize(file.size) === ATTACHMENT_ERRORS.FILE_TOO_LARGE) {
          setAttachmentError(t("status_messaging.file_too_large"));
          setIsDragActive(false);
        } else {
          const fileReader = new FileReader();
          fileReader.addEventListener("load", () => {
            const data = fileReader.result;

            if (!(data instanceof ArrayBuffer)) {
              return;
            }

            const attachment: Attachment = {
              filename: file.name,
              mimeType: file.type,
              data: new Uint8Array(data),
            };

            setAttachmentPreview(
              URL.createObjectURL(
                new Blob([Buffer.from(data)], {
                  type: attachment.mimeType,
                }),
              ),
            );

            setAttachment(attachment);
          });

          fileReader.readAsArrayBuffer(file);
          // resets the value so the same image can be re-uploaded after a deletion
          // not needed for drag events
          (e as ChangeEvent<HTMLInputElement>).target.value = "";
        }
      } else {
        setAttachment(undefined);
      }
      setIsDragActive(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setAttachment, setAttachmentPreview, setIsDragActive],
  );
  return {
    onAttachmentChange,
  };
};
