import { ContentTypeText } from "@xmtp/react-sdk";
import type {
  CachedConversation,
  CachedMessage,
  CachedMessageWithId,
} from "@xmtp/react-sdk";

export const getMockConversation = (
  values?: Partial<CachedConversation>,
): CachedConversation => ({
  createdAt: new Date(),
  peerAddress: "",
  topic: "",
  isReady: true,
  updatedAt: new Date(),
  walletAddress: values?.walletAddress ?? "",
  ...values,
});

export const getMockMessage = (
  id: number,
  values?: Partial<CachedMessage>,
): CachedMessageWithId => ({
  senderAddress: "",
  hasLoadError: false,
  hasSendError: false,
  isSending: false,
  status: "processed",
  xmtpID: window.crypto.randomUUID(),
  uuid: window.crypto.randomUUID(),
  sentAt: new Date(),
  conversationTopic: "",
  contentType: ContentTypeText.toString(),
  walletAddress: values?.walletAddress ?? "",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  content: values?.content,
  ...values,
  id,
});
