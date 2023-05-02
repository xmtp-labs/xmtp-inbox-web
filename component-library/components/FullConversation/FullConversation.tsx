import React from "react";
import { MessageSkeletonLoader } from "../Loaders/SkeletonLoaders/MessageSkeletonLoader";
import { useTranslation } from "react-i18next";

type FullConversationProps = React.PropsWithChildren & {
  isLoading?: boolean;
};

export const FullConversation: React.FC<FullConversationProps> = ({
  children,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className={"h-full flex flex-col-reverse justify-start p-4"}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <MessageSkeletonLoader key={idx} incoming={false} />
        ))}
      </div>
    );
  }

  return (
    <div
      data-testid="message-tile-container"
      className="w-full h-full flex flex-col-reverse pt-8 px-4 md:px-8">
      {children}
      <div
        className="text-gray-500 font-regular text-sm w-full py-2 text-center"
        data-testid="message-beginning-text">
        {t("messages.conversation_start")}
      </div>
    </div>
  );
};
