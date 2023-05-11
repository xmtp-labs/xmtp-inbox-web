import { DecodedMessage } from "@xmtp/xmtp-js";
import { Interweave } from "interweave";
import { EmailMatcher, UrlMatcher } from "interweave-autolink";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import type { MouseEvent } from "react";
import {
  ContentTypeGroupChatInvite,
  GroupChatInvite,
} from "../lib/GroupChatInviteCodec";
import { group } from "console";

const MessageContentWrapper = ({ message }: { message: DecodedMessage }) => {
  const [, source] = useEmojiData({
    compact: false,
    shortcodes: ["emojibase"],
  });

  if (message.contentType.sameAs(ContentTypeGroupChatInvite)) {
    const groupChatInvite = message.content as GroupChatInvite;
    return (
      <div className="text-center">
        Group chat with {groupChatInvite.members.length - 1} other wallet
        {groupChatInvite.members.length - 1 !== 1 && "s"}
      </div>
    );
  }

  return (
    <span className="interweave-content" data-testid="message-tile-text">
      <Interweave
        content={message.content}
        newWindow
        escapeHtml
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        matchers={[
          new UrlMatcher("url", { validateTLD: false }),
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
  );
};

export default MessageContentWrapper;
