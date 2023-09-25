import { create } from "zustand";
import type { ETHAddress } from "../helpers";

export type RecipientState = "invalid" | "loading" | "error" | "valid";

export type RecipientAddress = ETHAddress | null;

interface XmtpState {
  loadingConversations: boolean;
  setLoadingConversations: (loadingConversations: boolean) => void;
  clientName: string | null;
  setClientName: (name: string | null) => void;
  clientAvatar: string | null;
  setClientAvatar: (avatar: string | null) => void;
  recipientInput: string;
  setRecipientInput: (input: string) => void;
  recipientAddress: RecipientAddress;
  setRecipientAddress: (address: RecipientAddress) => void;
  recipientName: string | null;
  setRecipientName: (address: string | null) => void;
  recipientAvatar: string | null;
  setRecipientAvatar: (avatar: string | null) => void;
  recipientState: RecipientState;
  setRecipientState: (state: RecipientState) => void;
  recipientOnNetwork: boolean;
  setRecipientOnNetwork: (onNetwork: boolean) => void;
  conversationTopic?: string;
  setConversationTopic: (conversationTopic?: string) => void;
  resetXmtpState: () => void;
  resetRecipient: () => void;
  startedFirstMessage: boolean;
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
  attachmentError: string;
  setAttachmentError: (attachmentError: string) => void;
}

export const useXmtpStore = create<XmtpState>((set) => ({
  loadingConversations: true,
  setLoadingConversations: (loadingConversations: boolean) =>
    set(() => ({ loadingConversations })),
  clientName: null,
  setClientName: (name) => set(() => ({ clientName: name })),
  clientAvatar: null,
  setClientAvatar: (avatar) => set(() => ({ clientAvatar: avatar })),
  recipientInput: "",
  setRecipientInput: (input) => set(() => ({ recipientInput: input })),
  recipientAddress: null,
  setRecipientAddress: (address) => set(() => ({ recipientAddress: address })),
  recipientName: null,
  setRecipientName: (name) => set(() => ({ recipientName: name })),
  recipientAvatar: null,
  setRecipientAvatar: (avatar) => set(() => ({ recipientAvatar: avatar })),
  recipientState: "invalid",
  setRecipientState: (state) => set(() => ({ recipientState: state })),
  recipientOnNetwork: false,
  setRecipientOnNetwork: (onNetwork) =>
    set(() => ({ recipientOnNetwork: onNetwork })),
  conversationTopic: "",
  setConversationTopic: (conversationTopic) =>
    set(() => ({ conversationTopic })),
  resetXmtpState: () =>
    set(() => ({
      client: undefined,
      recipientInput: "",
      recipientAddress: null,
      recipientName: null,
      recipientAvatar: null,
      recipientState: "invalid",
      conversationTopic: undefined,
      startedFirstMessage: false,
    })),
  resetRecipient: () =>
    set(() => ({
      recipientInput: "",
      recipientAddress: null,
      recipientName: null,
      recipientAvatar: null,
      recipientState: "invalid",
    })),
  startedFirstMessage: false,
  setStartedFirstMessage: (startedFirstMessage) =>
    set(() => ({ startedFirstMessage })),
  attachmentError: "",
  setAttachmentError: (attachmentError) => set(() => ({ attachmentError })),
}));
