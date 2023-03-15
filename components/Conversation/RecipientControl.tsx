import { useState, useEffect } from "react";
import AddressInput from "../AddressInput";
import { useXmtpStore } from "../../store/xmtp";
import Conversation from "./Conversation";
import BackArrow from "../BackArrow";
import useWalletAddress from "../../hooks/useWalletAddress";
import useWindowSize from "../../hooks/useWindowSize";
import {
  RecipientInputMode,
  getConversationId,
  recipientPillInputStyle,
  isValidLongWalletAddress,
} from "../../helpers";
import { useAccount } from "wagmi";
import { getRecipientInputSubtext } from "../../helpers";

type RecipientControlProps = {
  setShowMessageView: Function;
};

const RecipientControl = ({
  setShowMessageView,
}: RecipientControlProps): JSX.Element => {
  const client = useXmtpStore((state) => state.client);
  const recipientWalletAddress =
    useXmtpStore((state) => state.recipientWalletAddress) || "";
  const conversationId = useXmtpStore((state) => state.conversationId);
  const setConversationId = useXmtpStore((state) => state.setConversationId);
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const size = useWindowSize();
  const [recipientInputMode, setRecipientInputMode] = useState(
    RecipientInputMode.InvalidEntry,
  );
  const { isValid, ensName, ensAddress } = useWalletAddress();
  const conversations = useXmtpStore((state) => state.conversations);
  const setConversations = useXmtpStore((state) => state.setConversations);
  const { address: walletAddress } = useAccount();

  const checkIfOnNetwork = async (address: string) => {
    let canMessage;
    if (client) {
      try {
        canMessage = await client.canMessage(address);
        if (!canMessage) {
          setRecipientInputMode(RecipientInputMode.NotOnNetwork);
        } else {
          setRecipientInputMode(RecipientInputMode.OnNetwork);
          setRecipientWalletAddress(address);
          setConversationId(address);
        }
      } catch (e) {
        setRecipientInputMode(RecipientInputMode.NotOnNetwork);
      }
    }
  };

  useEffect(() => {
    const setLookupValue = async () => {
      const conversationIdOnXmtp =
        conversationId?.replace(`${recipientWalletAddress}/`, "") ?? "";
      if (
        isValidLongWalletAddress(recipientWalletAddress) &&
        !conversations.get(recipientWalletAddress) &&
        !conversations.get(conversationId ?? "")
      ) {
        console.log("Creating convo 1");
        const conversation =
          conversationIdOnXmtp &&
          conversationIdOnXmtp !== recipientWalletAddress
            ? await client?.conversations?.newConversation(
                recipientWalletAddress,
                {
                  conversationId: conversationIdOnXmtp,
                  metadata: {},
                },
              )
            : await client?.conversations?.newConversation(
                recipientWalletAddress,
              );
        if (conversation) {
          console.log("Create successful");
          conversations.set(getConversationId(conversation), conversation);
          setConversations(new Map(conversations));
        }
      }
    };
    if (
      recipientWalletAddress &&
      recipientInputMode !== RecipientInputMode.OnNetwork
    ) {
      setRecipientInputMode(RecipientInputMode.OnNetwork);
    }
    if (recipientInputMode === RecipientInputMode.OnNetwork) {
      setLookupValue();
    }
  }, [recipientInputMode, recipientWalletAddress, conversationId]);

  const userIsSender = recipientWalletAddress === walletAddress;

  return (
    <div className="flex-col flex-1">
      <div className="flex-1 flex-col justify-center flex bg-zinc-50 md:border-b md:border-gray-200 md:px-4 md:pb-[2px] max-h-16 min-h-[4rem]">
        <div className="flex items-center">
          {size[0] < 600 && (
            <div className="flex items-center mx-2 w-3 mt-1">
              <BackArrow
                onClick={() => {
                  setShowMessageView(false);
                  setRecipientWalletAddress("");
                }}
              />
            </div>
          )}
          <form
            className="w-full flex pl-2 md:pl-0 h-8 pt-1"
            onSubmit={(e) => e.preventDefault()}
            action="#"
            method="GET">
            <label htmlFor="recipient-field" className="sr-only">
              Recipient
            </label>
            <div className="flex w-full text-n-300 focus-within:text-n-600">
              <div
                className="text-black flex items-center pointer-events-none text-md md:text-sm font-medium md:font-semibold mr-2"
                data-testid="message-to-key">
                To:
              </div>
              <div className="w-full">
                {isValid && (
                  <span
                    className={recipientPillInputStyle(userIsSender)}
                    data-testid="recipient-wallet-address">
                    {ensName ?? recipientWalletAddress}
                  </span>
                )}
                {!recipientWalletAddress && (
                  <AddressInput
                    id="recipient-field"
                    className="block w-[90%] pr-3 pt-[3px] md:pt-[2px] md:pt-[1px] bg-transparent caret-n-600 text-n-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-lg font-mono"
                    submitValue={checkIfOnNetwork}
                    setRecipientInputMode={setRecipientInputMode}
                  />
                )}
              </div>
              <button type="submit" className="hidden" />
            </div>
          </form>
        </div>
        {recipientInputMode === RecipientInputMode.Submitted ||
        recipientInputMode === RecipientInputMode.OnNetwork ? (
          <div className="text-md text-n-300 text-sm font-mono ml-7 pb-1 md:pb-[1px]">
            {ensName ? ensAddress ?? recipientWalletAddress : null}
          </div>
        ) : (
          <div
            className="text-sm md:text-xs text-n-300 ml-[29px] pl-2 md:pl-0 pb-1 md:pb-[3px]"
            data-testid="message-to-subtext">
            {getRecipientInputSubtext(recipientInputMode)}
          </div>
        )}
      </div>
      {recipientInputMode === RecipientInputMode.OnNetwork && <Conversation />}
    </div>
  );
};

export default RecipientControl;
