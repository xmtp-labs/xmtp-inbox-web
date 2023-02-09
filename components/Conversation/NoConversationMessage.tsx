import { ChatIcon } from '@heroicons/react/outline';

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center h-[100%]">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
          data-testid="empty-message-icon"
        />
        <p
          className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold"
          data-testid="empty-message-header"
        >
          Your message list is empty
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal" data-testid="empty-message-subheader">
          There are no messages for this address
        </p>
      </div>
    </div>
  );
};

export default NoConversationsMessage;
