import { PlusIcon } from "@heroicons/react/solid";
import { useTranslation } from "react-i18next";
import { classNames } from "../../../helpers";
import { IconButton } from "../IconButton/IconButton";
import { useXmtpStore } from "../../../store/xmtp";

// Rename HeaderDropdown to just Header
interface HeaderDropdownProps {
  /**
   * On new message button click?
   */
  onClick?: () => void;
  /**
   * What is the recipient input?
   */
  recipientInput: string;
  /**
   * Boolean to determine if screen width is mobile size
   */
  isMobileView?: boolean;
}

export const HeaderDropdown = ({
  onClick,
  recipientInput,
  isMobileView,
}: HeaderDropdownProps) => {
  const { t } = useTranslation();

  const activeTab = useXmtpStore((s) => s.activeTab);
  const setActiveTab = useXmtpStore((s) => s.setActiveTab);
  const resetRecipient = useXmtpStore((s) => s.resetRecipient);
  const setConversationTopic = useXmtpStore((s) => s.setConversationTopic);

  return (
    <div
      data-modal-target="headerModalId"
      data-testid="conversation-list-header"
      className="border-l border-r border-b border-gray-200 bg-gray-100 h-16 p-4 pt-5">
      <div className="flex justify-between items-center">
        <button
          id="preview-header"
          type="button"
          className={classNames(
            "text-lg mr-2 cursor-pointer",
            activeTab === "messages" ? "font-bold" : "",
          )}
          onClick={() => {
            setActiveTab("messages");
            resetRecipient();
            setConversationTopic();
          }}>
          {"Messages"}
        </button>
        <button
          id="preview-header"
          type="button"
          className={classNames(
            "text-lg mr-2 cursor-pointer",
            activeTab === "requests" ? "font-bold" : "",
          )}
          onClick={() => {
            setActiveTab("requests");
            resetRecipient();
            setConversationTopic();
          }}>
          {"Requests"}
        </button>
        <button
          id="preview-header"
          type="button"
          className={classNames(
            "text-lg mr-2 cursor-pointer",
            activeTab === "blocked" ? "font-bold" : "",
          )}
          onClick={() => {
            setActiveTab("blocked");
            resetRecipient();
            setConversationTopic();
          }}>
          {"Blocked"}
        </button>
        {(recipientInput || isMobileView) && (
          <IconButton
            onClick={() => onClick?.()}
            label={<PlusIcon color="white" width="20" />}
            testId="new-message-icon-cta"
            srText={t("aria_labels.start_new_message") || ""}
          />
        )}
      </div>
    </div>
  );
};
