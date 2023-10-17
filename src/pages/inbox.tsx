import type React from "react";
import { useEffect, useState } from "react";
import { useClient, useConversations } from "@xmtp/react-sdk";
import { useDisconnect, useWalletClient } from "wagmi";
import type { Attachment } from "@xmtp/content-type-remote-attachment";
import { useNavigate } from "react-router-dom";
import { RecipientAddress, useXmtpStore } from "../store/xmtp";
import { TAILWIND_MD_BREAKPOINT, wipeKeys } from "../helpers";
import { FullConversationController } from "../controllers/FullConversationController";
import { AddressInputController } from "../controllers/AddressInputController";
import { HeaderDropdownController } from "../controllers/HeaderDropdownController";
import { MessageInputController } from "../controllers/MessageInputController";
import { SideNavController } from "../controllers/SideNavController";
import { LearnMore } from "../component-library/components/LearnMore/LearnMore";
import useWindowSize from "../hooks/useWindowSize";
import { ConversationListController } from "../controllers/ConversationListController";
import { useAttachmentChange } from "../hooks/useAttachmentChange";
import useSelectedConversation from "../hooks/useSelectedConversation";
import useMessagePrefill from "../hooks/useMessagePrefill";

const Inbox: React.FC<{ children?: React.ReactNode }> = () => {
  const navigate = useNavigate();
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const { client, disconnect } = useClient();
  const [isDragActive, setIsDragActive] = useState(false);
  const { conversations } = useConversations();
  const selectedConversation = useSelectedConversation();
  const { data: walletClient } = useWalletClient();
  const { peerAddress } = useMessagePrefill();

  const setRecipientAddress = useXmtpStore((s) => s.setRecipientAddress);

  useEffect(() => {
    if (!client) {
      if (peerAddress) {
        setRecipientAddress(peerAddress as RecipientAddress);
        navigate(`/?peerAddress=${peerAddress}`);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const recipientAddress = useXmtpStore((s) => s.recipientAddress);

  const size = useWindowSize();

  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );
  const startedFirstMessage = useXmtpStore(
    (state) => state.startedFirstMessage,
  );
  const setStartedFirstMessage = useXmtpStore(
    (state) => state.setStartedFirstMessage,
  );

  const { disconnect: disconnectWagmi, reset: resetWagmi } = useDisconnect();

  const [attachmentPreview, setAttachmentPreview]: [
    string | undefined,
    (url: string | undefined) => void,
  ] = useState();

  const [attachment, setAttachment]: [
    Attachment | undefined,
    (attachment: Attachment | undefined) => void,
  ] = useState();

  const { onAttachmentChange } = useAttachmentChange({
    setAttachment,
    setAttachmentPreview,
    setIsDragActive,
  });

  // if the wallet address changes, disconnect the XMTP client
  useEffect(() => {
    const checkSigners = () => {
      const address1 = walletClient?.account.address;
      const address2 = client?.address;
      // addresses must be defined before comparing
      if (address1 && address2 && address1 !== address2) {
        resetXmtpState();
        void disconnect();
        wipeKeys(address1 ?? "");
        disconnectWagmi();
        resetWagmi();
      }
    };
    void checkSigners();
  }, [
    disconnect,
    resetXmtpState,
    walletClient,
    client?.address,
    resetWagmi,
    disconnectWagmi,
  ]);

  if (!client) {
    return <div />;
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  return (
    // Controller for drag-and-drop area
    <div
      className={isDragActive ? "bg-slate-100" : "bg-white"}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDrop={onAttachmentChange}>
      <div className="w-full md:h-full overflow-auto flex flex-col md:flex-row">
        <div className="flex">
          {size[0] > TAILWIND_MD_BREAKPOINT ||
          (!recipientAddress && !startedFirstMessage) ? (
            <>
              <SideNavController />
              <div className="flex flex-col w-full h-screen overflow-y-auto md:min-w-[350px]">
                <HeaderDropdownController />
                <ConversationListController
                  setStartedFirstMessage={setStartedFirstMessage}
                />
              </div>
            </>
          ) : null}
        </div>

        {size[0] > TAILWIND_MD_BREAKPOINT ||
        recipientAddress ||
        startedFirstMessage ? (
          <div className="flex w-full flex-col h-screen overflow-hidden">
            {!conversations.length &&
            !loadingConversations &&
            !recipientAddress &&
            !startedFirstMessage ? (
              <LearnMore
                version="replace"
                setStartedFirstMessage={() => setStartedFirstMessage(true)}
              />
            ) : (
              <>
                <div className="flex">
                  <AddressInputController />
                </div>
                <div className="h-full overflow-auto flex flex-col">
                  {selectedConversation && (
                    <FullConversationController
                      conversation={selectedConversation}
                    />
                  )}
                </div>
                {/* Drag event handling needing for content attachments */}
                <MessageInputController
                  attachment={attachment}
                  setAttachment={setAttachment}
                  attachmentPreview={attachmentPreview}
                  setAttachmentPreview={setAttachmentPreview}
                  setIsDragActive={setIsDragActive}
                />
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Inbox;
