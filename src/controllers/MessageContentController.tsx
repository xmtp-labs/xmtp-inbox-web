import type React from "react";
import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import type { DecodedMessage } from "@xmtp/react-sdk";
import RemoteAttachmentMessageTile from "../component-library/components/RemoteAttachmentMessageTile/RemoteAttachmentMessageTile";
import TextMessageTile from "../component-library/components/TextMessageTile/TextMessageTile";

type MessageContentControllerProps = {
  message: DecodedMessage;
  isSelf: boolean;
  isLoading: boolean;
  isError: boolean;
};

const MessageContentController: React.FC<MessageContentControllerProps> = ({
  message,
  isSelf,
  isLoading,
  isError,
}) => {
  // remote attachments content type
  if (ContentTypeRemoteAttachment.sameAs(message.contentType)) {
    return (
      <RemoteAttachmentMessageTile
        content={message.content}
        isSelf={isSelf}
        isLoading={isLoading}
        isError={isError}
      />
    );
  }

  // default (text) content type
  return <TextMessageTile content={message.content} />;
};

export default MessageContentController;
