import { useState, useEffect } from "react";
import { DecodedMessage } from "@xmtp/xmtp-js";
import {
  Attachment,
  RemoteAttachment,
  RemoteAttachmentCodec,
} from "xmtp-content-type-remote-attachment";
import { useXmtpStore } from "../../store/xmtp";

type RemoteAttachmentMessageTileProps = {
  message: DecodedMessage;
};

function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

type status = "unloaded" | "loadRequested" | "loading" | "loaded" | "error";

const RemoteAttachmentMessageTile = ({
  message,
}: RemoteAttachmentMessageTileProps) => {
  const [status, setStatus] = useState<status>("unloaded");
  const [url, setURL] = useState<string | null>(null);

  const remoteAttachment: RemoteAttachment = message.content;

  const client = useXmtpStore((state) => state.client);

  useEffect(() => {
    const handleLoading = async () => {
      if (status === "loadRequested") {
        setStatus("loading");

        if (client) {
          const attachment: Attachment = await RemoteAttachmentCodec.load(
            remoteAttachment,
            client,
          );

          const objectURL = URL.createObjectURL(
            new Blob([Buffer.from(attachment.data)], {
              type: attachment.mimeType,
            }),
          );

          setURL(objectURL);
          setStatus("loaded");
        }

        return;
      }
    };
    handleLoading();
  }, [status, client, remoteAttachment]);

  function load() {
    setStatus("loadRequested");
  }

  return (
    <div>
      {status === "loading" ? "Loading…" : ""}
      {url ? (
        <img src={url} style={{ maxHeight: "200px", borderRadius: "12px" }} />
      ) : (
        ""
      )}
      <small>
        {remoteAttachment.filename} -{" "}
        {humanFileSize(remoteAttachment.contentLength)}
        {status == "loaded" || (
          <button onClick={load} type="button">
            - Load
          </button>
        )}
      </small>
    </div>
  );
};

export default RemoteAttachmentMessageTile;
