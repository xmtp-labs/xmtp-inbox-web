import React from 'react';
import { Conversation } from '@xmtp/xmtp-js';
import { getConversationKey } from '../helpers';
import { useXmtpStore } from '../store/xmtp';
import NoConversationsMessage from './Conversation/NoConversationMessage';
import ConversationTile from './Conversation/ConversationTile';

type ConversationTileProps = {
  conversation: Conversation;
};

const ConversationsList = (): JSX.Element => {
  const conversations = useXmtpStore((state) => state.conversations);
  const previewMessages = useXmtpStore((state) => state.previewMessages);

  const orderByLatestMessage = (convoA: Conversation, convoB: Conversation): number => {
    const convoALastMessageDate = previewMessages.get(getConversationKey(convoA))?.sent || new Date();
    const convoBLastMessageDate = previewMessages.get(getConversationKey(convoB))?.sent || new Date();
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1;
  };

  if (!conversations || conversations.size == 0) {
    return <NoConversationsMessage />;
  }

  return (
    <>
      {conversations &&
        conversations.size > 0 &&
        Array.from(conversations.values())
          .sort(orderByLatestMessage)
          .map((convo) => {
            return <ConversationTile key={getConversationKey(convo)} conversation={convo} />;
          })}
    </>
  );
};

export default React.memo(ConversationsList);
