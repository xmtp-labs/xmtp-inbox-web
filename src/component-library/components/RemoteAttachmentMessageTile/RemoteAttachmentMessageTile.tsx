import { useState, useEffect } from "react";
import type {
  Attachment,
  RemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import { RemoteAttachmentCodec } from "@xmtp/content-type-remote-attachment";
import { useClient } from "@xmtp/react-sdk";
import Zoom from "react-medium-image-zoom";
import { useTranslation } from "react-i18next";
import {
  getContentTypeFromFileName,
  humanFileSize,
} from "../../../helpers/attachments";
import "react-medium-image-zoom/dist/styles.css";
import { db } from "../../../helpers/attachment_db";

import { ATTACHMENT_ERRORS } from "../../../helpers";

type RemoteAttachmentMessageTileProps = {
  content: RemoteAttachment;
  isSelf: boolean;
  isLoading: boolean;
  isError: boolean;
};

type status = "unloaded" | "loadRequested" | "loading" | "loaded" | "error";

/**
 * Creating object URLs from blobs is non-deterministic, so we store the
 * generated URLs in a cache so that they can be reused, which results in
 * a more consistent rendering of images/data and less memory usage.
 */
const blobCache = new WeakMap<Uint8Array, string>();

const RemoteAttachmentMessageTile = ({
  content,
  isSelf,
  isLoading,
  isError,
}: RemoteAttachmentMessageTileProps) => {
  const [status, setStatus] = useState<status>("unloaded");
  const [url, setURL] = useState<string | null>(null);
  const { t } = useTranslation();
  const fileSize = humanFileSize(content.contentLength);

  const { client } = useClient();

  useEffect(() => {
    const handleLoading = async () => {
      if (status === "loadRequested") {
        setStatus("loading");

        if (client) {
          const attachment: Attachment = await RemoteAttachmentCodec.load(
            content,
            client,
          );

          if (!blobCache.get(attachment.data)) {
            blobCache.set(
              attachment.data,
              URL.createObjectURL(
                new Blob([Buffer.from(attachment.data)], {
                  type: attachment.mimeType,
                }),
              ),
            );
          }

          const objectURL = blobCache.get(attachment.data);

          db.attachments
            .add({
              contentURL: content.url,
              filename: attachment.filename,
              mimetype: attachment.mimeType,
              contentDataURL: objectURL!,
            })
            .then(() => {
              setURL(objectURL!);
              setStatus("loaded");
            })
            .catch((e: Error) => {
              // If error adding to cache, can silently fail and no need to display an error
              console.error("Error caching image --> ", e);
              setURL(objectURL!);
              setStatus("loaded");
            });
        }
      }
    };
    void handleLoading();
  }, [status, client, content]);

  const load = (inCache = false, clickedToLoad = false) => {
    // If attachment is not in cache and it is the appropriate file size,
    // or it's too large and user has initiated this anyway, run handleLoading
    const loadImage =
      clickedToLoad === true ||
      (!inCache && fileSize !== ATTACHMENT_ERRORS.FILE_TOO_LARGE);
    if (loadImage) {
      setStatus("loadRequested");
    }
  };

  useEffect(() => {
    // Check if this is in cache
    db.attachments
      .get({ contentURL: content.url })
      .then((attachment) => {
        if (attachment?.contentDataURL) {
          setURL(attachment.contentDataURL);
          setStatus("loaded");
        } else {
          load();
        }
      })
      .catch(() => {
        // If error retrieving from cache, can silently fail and no need to display an error
        load();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contentType = getContentTypeFromFileName(content?.filename);

  return isError ? (
    <p className="text-red-600 p-0">{t("status_messaging.error_1_header")}</p>
  ) : (
    <div>
      {status === "loading" || isLoading ? t("status_messaging.loading") : ""}
      {url ? (
        <Zoom>
          {contentType === "video" ? (
            <video controls autoPlay>
              <source src={url} type="video/mp4" />
              {t("attachments.video_messages_not_supported")}
            </video>
          ) : contentType === "application" ? (
            <object
              data={url}
              type="application/pdf"
              width="100%"
              height="500px">
              <p>{t("attachments.unable_to_display")}</p>
              <a href={url}>{t("attachments.download_instead")}</a>
            </object>
          ) : contentType === "image" ? (
            <img
              src={url}
              className="max-h-80 rounded-lg"
              alt={content.filename}
            />
          ) : (
            <div className="flex text-blue-600 font-bold">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {content.filename} ({fileSize})
              </a>
            </div>
          )}
        </Zoom>
      ) : null}
      {status !== "loaded" &&
      !isSelf &&
      fileSize === ATTACHMENT_ERRORS.FILE_TOO_LARGE ? (
        <small>
          {content.filename} - {humanFileSize(content.contentLength)}
          <button onClick={() => load(false, true)} type="button">
            {`- ${t("messages.attachment_cta")}`}
          </button>
        </small>
      ) : null}
    </div>
  );
};

export default RemoteAttachmentMessageTile;
