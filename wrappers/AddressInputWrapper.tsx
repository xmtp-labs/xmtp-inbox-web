import React from "react";
import { useEnsAvatar } from "wagmi";
import { AddressInput } from "../component-library/components/AddressInput/AddressInput";
import { getRecipientInputSubtext, RecipientInputMode } from "../helpers";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import useWalletAddress from "../hooks/useWalletAddress";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";

export const AddressInputWrapper = () => {
  // XMTP State
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
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

  return (
    <AddressInput
      isError={!isValid}
      subtext={
        !loadingConversations
          ? getRecipientInputSubtext(recipientInputMode)
          : ""
      }
      resolvedAddress={{
        displayAddress: ensName ?? recipientWalletAddress,
        walletAddress: ensName ? recipientWalletAddress : "",
      }}
      onChange={setRecipientEnteredValue}
      isLoading={
        RecipientInputMode.FindingEntry === recipientInputMode ||
        loadingConversations
      }
      value={recipientEnteredValue}
      avatarUrlProps={{
        avatarUrl: recipientAvatarUrl || "",
        isLoading: avatarLoading || loadingConversations,
        address: recipientWalletAddress,
      }}
    />
  );
};
