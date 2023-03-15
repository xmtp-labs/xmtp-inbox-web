import React from "react";
import { MessageSkeletonLoader } from "../Loaders/SkeletonLoaders/MessageSkeletonLoader";

interface FullConversationProps {
  messages?: Array<JSX.Element>;
  isLoading?: boolean;
}

export const FullConversation = ({
  messages = [],
  isLoading = false,
}: FullConversationProps) => {
  if (isLoading) {
    const alternatingMessages = (
      <>
        <MessageSkeletonLoader incoming={false} /> <MessageSkeletonLoader />
      </>
    );
    return (
      <div
        className={`h-full flex flex-col-reverse justify-start p-4 overflow-auto`}>
        {Array(3).fill(alternatingMessages)}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col-reverse p-4">
      <div data-testid="message-tile-container">{messages}</div>
      <div
        className="text-gray-300 font-bold text-sm w-full text-center"
        data-testid="message-beginning-text">
        This is the beginning of the conversation
      </div>
    </div>
  );
};
