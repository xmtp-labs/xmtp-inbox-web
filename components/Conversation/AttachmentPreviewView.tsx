import {
  Attachment,
  RemoteAttachment,
  RemoteAttachmentCodec,
} from "xmtp-content-type-remote-attachment";
import { useXmtpStore } from "../../store/xmtp";

type AttachmentPreviewViewProps = {
  attachment: Attachment;
};

const imageTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

function contentFor(attachment: Attachment): JSX.Element {
  if (imageTypes.includes(attachment.mimeType)) {
    const objectURL = URL.createObjectURL(
      new Blob([Buffer.from(attachment.data)], {
        type: attachment.mimeType,
      }),
    );

    return (
      <img
        src={objectURL}
        alt={attachment.filename}
        style={{
          maxHeight: "200px",
          marginBottom: "1em",
          borderRadius: "12px",
        }}
      />
    );
  } else {
    return <span>{attachment.filename}</span>;
  }
}

const AttachmentPreviewView = ({
  attachment,
}: AttachmentPreviewViewProps): JSX.Element => {
  return contentFor(attachment);
};

export default AttachmentPreviewView;
