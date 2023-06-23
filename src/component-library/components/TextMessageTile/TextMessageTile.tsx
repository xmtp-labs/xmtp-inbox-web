import { Interweave } from "interweave";
import { EmailMatcher, UrlMatcher } from "interweave-autolink";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import { useCallback, type MouseEvent } from "react";

type TextMessageTileProps = {
  content?: string;
};

const TextMessageTile: React.FC<TextMessageTileProps> = ({ content }) => {
  const [, source] = useEmojiData({
    compact: false,
    shortcodes: ["emojibase"],
  });

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => event.stopPropagation(),
    [],
  );

  return (
    <div className="interweave-content" data-testid="message-tile-text">
      <Interweave
        content={content ?? ""}
        newWindow
        escapeHtml
        onClick={handleClick}
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
    </div>
  );
};

export default TextMessageTile;
