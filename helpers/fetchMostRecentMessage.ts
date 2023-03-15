import { Conversation, DecodedMessage, SortDirection } from "@xmtp/xmtp-js";
import { getConversationId } from "./string";

const fetchMostRecentMessage = async (
  convo: Conversation,
): Promise<{ key: string; message?: DecodedMessage }> => {
  console.log('fetchign most recent message')
  const key = getConversationId(convo);
  const newMessages = await convo?.messages({
    limit: 1,
    direction: SortDirection.SORT_DIRECTION_DESCENDING,
  });

  if (!newMessages?.length) {
    console.log('no recent message')
    return { key };
  }
    console.log('message found')
  return { key, message: newMessages[0] };
};

export default fetchMostRecentMessage;
