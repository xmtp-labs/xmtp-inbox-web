import { Conversation } from "@xmtp/xmtp-js";

export const truncate = (str: string | undefined, length: number): string => {
  if (!str) {
    return "";
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`;
  }
  return str;
};

export const isValidRecipientAddressFormat = (
  recipientWalletAddress: string,
) => {
  return (
    recipientWalletAddress?.endsWith(".eth") ||
    (recipientWalletAddress?.startsWith("0x") &&
      recipientWalletAddress?.length === 42)
  );
};

export const isValidLongWalletAddress = (recipientWalletAddress: string) => {
  return (
    recipientWalletAddress?.startsWith("0x") &&
    recipientWalletAddress?.length === 42
  );
};

export const isEnsAddress = (address: string): boolean => {
  return address.endsWith(".eth");
};

export const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith("0x")
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;

export const getConversationId = (conversation?: Conversation): string => {
  return conversation?.context?.conversationId
    ? `${conversation?.peerAddress}/${conversation?.context?.conversationId}`
    : conversation?.peerAddress ?? "";
};
