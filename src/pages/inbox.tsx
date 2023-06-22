import type React from "react";
import { useEffect, useState } from "react";
import { useClient } from "@xmtp/react-sdk";
import { useDisconnect, useSigner } from "wagmi";
import { useNavigate } from "react-router-dom";
import type { Attachment } from "@xmtp/content-type-remote-attachment";
import { useXmtpStore } from "../store/xmtp";
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
import { db } from "../helpers/attachment_db";

export type address = `0x${string}`;

const Inbox: React.FC<{ children?: React.ReactNode }> = () => {
  const navigate = useNavigate();
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const { client, disconnect, signer: clientSigner } = useClient();
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!client) {
      navigate("/");
    }
    // any time the client changes, the attachments cached db should be cleared
    // this is because the contentDataURL is partially derived from client
    // and doesn't render properly if image is in cache with a different client.
    void db.attachments.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const { data: signer } = useSigner();
  // XMTP Store
  const conversations = useXmtpStore((state) => state.conversations);
  const conversationId = useXmtpStore((state) => state.conversationId);

  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );

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
    const checkSigners = async () => {
      const address1 = await signer?.getAddress();
      const address2 = await clientSigner?.getAddress();
      // addresses must be defined before comparing
      if (address1 && address2 && address1 !== address2) {
        resetXmtpState();
        disconnect();
        wipeKeys(address1 ?? "");
        disconnectWagmi();
        resetWagmi();
      }
    };
    void checkSigners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSigner, disconnect, resetXmtpState, signer]);

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
        <div className="flex md:w-1/2 md:max-w-md">
          {size[0] > TAILWIND_MD_BREAKPOINT ||
          (!recipientWalletAddress && !startedFirstMessage) ? (
            <>
              <SideNavController />
              <div className="flex flex-col w-full h-screen overflow-y-auto">
                <HeaderDropdownController />
                <ConversationListController
                  setStartedFirstMessage={setStartedFirstMessage}
                />
              </div>
            </>
          ) : null}
        </div>
        {size[0] > TAILWIND_MD_BREAKPOINT ||
        recipientWalletAddress ||
        startedFirstMessage ? (
          <div className="flex w-full flex-col h-screen overflow-hidden">
            {!conversations.size &&
            !loadingConversations &&
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
                  {conversationId && <FullConversationController />}
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
