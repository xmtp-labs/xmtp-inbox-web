import { Conversation, ContentTypeId } from '@xmtp/xmtp-js';
import { useCallback } from 'react';

interface Message {
  content: string;
  contentType?: string;
}

const useSendMessage = (selectedConversation?: Conversation) => {
  const sendMessage = useCallback(
    async (message: Message) => {
      const ContentTypeVoiceKey = new ContentTypeId({
        authorityId: 'xmtp.test',
        typeId: 'audio-key',
        versionMajor: 1,
        versionMinor: 0
      });

      const messageText = message.content;
      const isAudioNote = message.contentType === 'voice-note';

      if (isAudioNote) {
        await selectedConversation?.send(messageText, {
          contentType: ContentTypeVoiceKey,
          contentFallback: 'This is a voice note'
        });
      } else {
        await selectedConversation?.send(messageText);
      }
    },
    [selectedConversation]
  );

  return {
    sendMessage
  };
};

export default useSendMessage;
