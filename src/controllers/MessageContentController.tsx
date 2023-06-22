import { Interweave } from "interweave";
import { EmailMatcher, UrlMatcher } from "interweave-autolink";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import type { MouseEvent } from "react";
import type { RemoteAttachment } from "@xmtp/content-type-remote-attachment";
import RemoteAttachmentMessageTile from "../component-library/components/RemoteAttachmentMessageTile/RemoteAttachmentMessageTile";

interface MessageContentControllerProps {
  content: undefined | string | RemoteAttachment;
  isSelf: boolean;
  isLoading: boolean;
  isError: boolean;
}

const MessageContentController = ({
  content,
  isSelf,
  isLoading,
  isError,
}: MessageContentControllerProps) => {
  const [, source] = useEmojiData({
    compact: false,
    shortcodes: ["emojibase"],
  });

  return content === undefined || typeof content === "string" ? (
    <span className="interweave-content" data-testid="message-tile-text">
      <Interweave
        content={content ?? ""}
        newWindow
        escapeHtml
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        matchers={[
          new UrlMatcher("url"),
          new EmojiMatcher("emoji", {
            convertEmoticon: true,
            convertShortcode: true,
            renderUnicode: true,
          }),
          new EmailMatcher("email"),
        ]}
        emojiSource={source}
      />
    </span>
  ) : content.url ? (
    <RemoteAttachmentMessageTile
      content={content}
      isSelf={isSelf}
      isLoading={isLoading}
      isError={isError}
    />
  ) : null;
};

export default MessageContentController;
