import { useEffect } from "react";
import { useConversation } from "@xmtp/react-sdk";
import { AddressInput } from "../component-library/components/AddressInput/AddressInput";
import { getRecipientInputSubtext, shortAddress } from "../helpers";
import useWindowSize from "../hooks/useWindowSize";
import { useXmtpStore } from "../store/xmtp";
import { useAddressInput } from "../hooks/useAddressInput";

export const AddressInputController = () => {
  // XMTP State
  const recipientAddress = useXmtpStore((s) => s.recipientAddress);
  const recipientAvatar = useXmtpStore((s) => s.recipientAvatar);
  const recipientState = useXmtpStore((s) => s.recipientState);
  const recipientOnNetwork = useXmtpStore((s) => s.recipientOnNetwork);
  const recipientInput = useXmtpStore((s) => s.recipientInput);
  const recipientName = useXmtpStore((s) => s.recipientName);
  const conversationTopic = useXmtpStore((s) => s.conversationTopic);
  const resetRecipient = useXmtpStore((s) => s.resetRecipient);
  const loadingConversations = useXmtpStore((s) => s.loadingConversations);
  const setRecipientInput = useXmtpStore((s) => s.setRecipientInput);
  const setStartedFirstMessage = useXmtpStore((s) => s.setStartedFirstMessage);
  const setConversationTopic = useXmtpStore((s) => s.setConversationTopic);
  const { getCachedByPeerAddress } = useConversation();

  // manage address input state
  useAddressInput();

  const size = useWindowSize();

  useEffect(() => {
    const selectConversation = async () => {
      // if there's a valid network address, look for an existing conversation
      if (recipientAddress && recipientOnNetwork) {
        const existing = await getCachedByPeerAddress(recipientAddress);
        // only set the conversation topic if it's different from the existing one
        if (existing && conversationTopic !== existing.topic) {
          setConversationTopic(existing.topic);
        }
      }
    };
    void selectConversation();
  }, [
    conversationTopic,
    getCachedByPeerAddress,
    recipientAddress,
    recipientOnNetwork,
    setConversationTopic,
  ]);

  return (
    <AddressInput
      isError={recipientState === "invalid" || recipientState === "error"}
      subtext={
        !loadingConversations
          ? getRecipientInputSubtext(
              recipientInput,
              recipientAddress,
              recipientState,
              recipientOnNetwork,
            )
          : ""
      }
      resolvedAddress={{
        displayAddress:
          recipientName ??
          (size[0] < 700
            ? recipientAddress
              ? shortAddress(recipientAddress)
              : ""
            : recipientAddress ?? ""),
        walletAddress: recipientName
          ? recipientAddress ?? undefined
          : undefined,
      }}
      onChange={setRecipientInput}
      isLoading={recipientState === "loading"}
      value={recipientInput}
      avatarUrlProps={{
        url: recipientAvatar || "",
        isLoading: recipientState === "loading",
        address: recipientAddress ?? undefined,
      }}
      onLeftIconClick={() => {
        resetRecipient();
        setStartedFirstMessage(false);
        setConversationTopic("");
      }}
    />
  );
};
