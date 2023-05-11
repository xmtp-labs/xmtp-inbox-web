import React from "react";
import { useEnsAvatar } from "wagmi";
import { AddressInput } from "../component-library/components/AddressInput/AddressInput";
import {
  getRecipientInputSubtext,
  RecipientInputMode,
  shortAddress,
} from "../helpers";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import useWalletAddress from "../hooks/useWalletAddress";
import { address } from "../pages/inbox";
import useWindowSize from "../hooks/useWindowSize";
import { useXmtpStore } from "../store/xmtp";

export const AddressInputWrapper = () => {
  // XMTP State
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const setStartedFirstMessage = useXmtpStore(
    (state) => state.setStartedFirstMessage,
  );
  const setConversationId = useXmtpStore((state) => state.setConversationId);
  const setRecipientInputMode = useXmtpStore(
    (state) => state.setRecipientInputMode,
  );

  // XMTP Hooks
  const {
    recipientInputMode,
    recipientEnteredValue,
    setRecipientEnteredValue,
  } = useGetRecipientInputMode();

  const { isValid, ensName } = useWalletAddress();

  // Wagmi Hooks
  const { data: recipientAvatarUrl, isLoading: avatarLoading } = useEnsAvatar({
    address: recipientWalletAddress as address,
  });

  const size = useWindowSize();

  return (
    <AddressInput
      isError={recipientEnteredValue ? !isValid : false}
      subtext={
        !loadingConversations
          ? getRecipientInputSubtext(recipientInputMode, recipientEnteredValue)
          : ""
      }
      onChange={setRecipientEnteredValue}
      isLoading={
        RecipientInputMode.FindingEntry === recipientInputMode ||
        loadingConversations
      }
      value={recipientEnteredValue}
      avatarUrlProps={{
        url: recipientAvatarUrl || "",
        isLoading: avatarLoading || loadingConversations,
        address: recipientWalletAddress,
      }}
      onLeftIconClick={() => {
        setRecipientEnteredValue("");
        setRecipientWalletAddress("");
        setStartedFirstMessage(false);
        setConversationId("");
        setRecipientInputMode(RecipientInputMode.InvalidEntry);
      }}
    />
  );
};
