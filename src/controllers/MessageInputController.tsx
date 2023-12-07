import type { Attachment } from "@xmtp/content-type-remote-attachment";
import { useClient, useStartConversation } from "@xmtp/react-sdk";
import ReactModal from "react-modal";
import { useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { MessageInput } from "../component-library/components/MessageInput/MessageInput";
import useSendMessage from "../hooks/useSendMessage";
import useSelectedConversation from "../hooks/useSelectedConversation";
import { useXmtpStore } from "../store/xmtp";

interface MessageInputControllerProps {
  attachment?: Attachment;
  attachmentPreview?: string;
  setAttachment: (attachment: Attachment | undefined) => void;
  setAttachmentPreview: (url: string | undefined) => void;
  setIsDragActive: (status: boolean) => void;
}

export const MessageInputController = ({
  attachment,
  setAttachment,
  attachmentPreview,
  setAttachmentPreview,
  setIsDragActive,
}: MessageInputControllerProps) => {
  // XMTP Hooks
  const conversation = useSelectedConversation();
  const address = useClient().client?.address;
  const activeTab = useXmtpStore((s) => s.activeTab);
  const recipientOnNetwork = useXmtpStore((s) => s.recipientOnNetwork);
  const recipientAddress = useXmtpStore((s) => s.recipientAddress);
  const activeMessage = useXmtpStore((s) => s.activeMessage);
  const [shouldModalOpen, setShouldModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { startConversation } = useStartConversation();
  const { sendMessage } = useSendMessage(
    attachment || undefined,
    activeMessage,
  );

  useEffect(() => {
    if (activeTab === "requested") {
      setShouldModalOpen(true);
    }
  }, [activeTab]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "60%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "400px",
      display: "flex",
      flexDirection: "column",
    },
  };

  return (
    <MessageInput
      shouldModalOpen={shouldModalOpen}
      handleOpenModal={handleOpenModal}
      peerAddress={recipientAddress}
      isDisabled={!recipientOnNetwork}
      startConversation={startConversation}
      sendMessage={sendMessage}
      conversation={conversation}
      attachment={attachment}
      setAttachment={setAttachment}
      attachmentPreview={attachmentPreview}
      setAttachmentPreview={setAttachmentPreview}
      setIsDragActive={setIsDragActive}
    />
  );
};
