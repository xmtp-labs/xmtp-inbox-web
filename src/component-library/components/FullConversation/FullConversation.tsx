import { useTranslation } from "react-i18next";
import type { VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useMemo, useRef } from "react";
import { useConsent } from "@xmtp/react-sdk";
import { useXmtpStore } from "../../../store/xmtp";

interface FullConversationProps {
  messages?: Array<JSX.Element | null>;
  isLoading?: boolean;
  activeTab: string;
}

const LoadingMessage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex align-center justify-center text-gray-500 font-regular text-sm animate-pulse">
      {t("messages.conversation_loading")}
    </div>
  );
};

const BeginningMessage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      className="text-gray-500 font-regular text-sm w-full py-2 text-center"
      data-testid="message-beginning-text">
      {t("messages.conversation_start")}
    </div>
  );
};

const AcceptOrDeny: React.FC = ({ address }) => {
  const { t } = useTranslation();
  const { allow, deny } = useConsent();
  const setActiveTab = useXmtpStore((s) => s.setActiveTab);
  const activeTab = useXmtpStore((s) => s.activeTab);

  return activeTab !== "requests" ? null : (
    <div
      className="bg-gray-300 p-4 w-full flex flex-col justify-center items-center text-gray-500"
      data-testid="accept_or_deny_container">
      <h3 className="font-bold">New message request</h3>
      <p>
        You have never interacted with this wallet address before. What would
        you like to do?
      </p>
      <div className="flex w-full justify-between p-3 gap-2">
        <button
          type="button"
          className="text-blue-300 flex w-full justify-center border border-2 border-blue-300 rounded-md p-2 hover:bg-blue-300 hover:text-white"
          onClick={() => {
            void allow([address]);
            setActiveTab("messages");
          }}>
          Accept
        </button>
        <button
          type="button"
          className="text-indigo-300 flex w-full justify-center border border-2 border-indigo-300 rounded-md p-2 hover:bg-indigo-300 hover:text-white"
          onClick={() => {
            void deny([address]);
            setActiveTab("blocked");
          }}>
          Block
        </button>
      </div>
    </div>
  );
};

export const FullConversation = ({
  messages = [],
  isLoading = false,
  address,
}: FullConversationProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const filteredMessages = useMemo(() => {
    const filtered = messages.filter((msg) => msg !== null);
    return [
      isLoading ? (
        <LoadingMessage key="loading" />
      ) : (
        <BeginningMessage key="beginning" />
      ),
      ...filtered,
      <AcceptOrDeny address={address} />,
    ];
  }, [isLoading, messages]);

  return (
    <Virtuoso
      alignToBottom
      data={filteredMessages}
      totalCount={filteredMessages.length}
      initialTopMostItemIndex={filteredMessages.length - 1}
      followOutput="auto"
      className="w-full h-full flex flex-col"
      itemContent={(index, message) => message}
      ref={virtuosoRef}
    />
  );
};
