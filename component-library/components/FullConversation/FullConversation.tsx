import React from "react";
import { MessageLoader } from "../Loaders/SkeletonLoaders";

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
        <MessageLoader incoming={false} /> <MessageLoader />
      </>
    );
    return (
      <div
        className={`h-full flex flex-col-reverse justify-start p-4 overflow-scroll`}>
        {Array(3).fill(alternatingMessages)}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col-reverse p-4 ">
      {messages}
      <div className="text-gray-300 font-bold text-sm w-full text-center">
        This is the beginning of the conversation
      </div>
    </div>
  );
};
