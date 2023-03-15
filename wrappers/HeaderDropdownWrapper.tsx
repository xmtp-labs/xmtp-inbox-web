import React from "react";
import { HeaderDropdown } from "../component-library/components/HeaderDropdown/HeaderDropdown";
import { RecipientInputMode } from "../helpers";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import { useXmtpStore } from "../store/xmtp";

export const HeaderDropdownWrapper = () => {
  // XMTP State
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const setConversationId = useXmtpStore((state) => state.setConversationId);
  const setStartedFirstMessage = useXmtpStore(
    (state) => state.setStartedFirstMessage,
  );

  // XMTP Hooks
  const { setRecipientInputMode, setRecipientEnteredValue } =
    useGetRecipientInputMode();

  return (
    <HeaderDropdown
      onClick={() => {
        setRecipientWalletAddress("");
        setRecipientInputMode(RecipientInputMode.InvalidEntry);
        setConversationId();
        setRecipientEnteredValue("");
        setStartedFirstMessage();
      }}
      disabled
    />
  );
};
