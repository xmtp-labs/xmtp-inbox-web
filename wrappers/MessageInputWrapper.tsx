import React from "react";
import { MessageInput } from "../component-library/components/MessageInput/MessageInput";
import { RecipientInputMode } from "../helpers";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import useSendMessage from "../hooks/useSendMessage";

export const MessageInputWrapper = () => {
  // XMTP Hooks
  const { recipientInputMode, conversationId } = useGetRecipientInputMode();
  const { sendMessage } = useSendMessage(conversationId as string);

  return (
    <MessageInput
      isDisabled={recipientInputMode !== RecipientInputMode.OnNetwork}
      onSubmit={sendMessage}
    />
  );
};
