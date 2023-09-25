import {
  updateConversationMetadata,
  type CachedConversation,
  getCachedConversationByTopic,
} from "@xmtp/react-sdk";
import type Dexie from "dexie";
import type { ETHAddress } from "./string";
import {
  throttledFetchUnsNames,
  throttledFetchEnsAvatar,
  throttledFetchEnsName,
  throttledFetchAddressName,
} from "./string";
import { chunkArray, memoizeThrottle } from "./functions";
import { API_FETCH_THROTTLE } from "./constants";

export type PeerAddressIdentity = {
  name: string | null;
  avatar: string | null;
};

export type PeerIdentityMetadata = PeerAddressIdentity | undefined;

/**
 * Get the peer identity of a conversation
 *
 * @param conversation The conversation to get the peer identity of
 * @returns The peer identity of the conversation
 */
export const getPeerAddressIdentity = (conversation: CachedConversation) => {
  const metadata = conversation.metadata?.peerIdentity as PeerIdentityMetadata;
  return {
    name: metadata?.name || null,
    avatar: metadata?.avatar || null,
  };
};

/**
 * Get the peer identity of a conversation
 *
 * @param conversation The conversation to get the peer identity of
 * @returns The peer identity of the conversation
 */
export const fetchPeerAddressIdentity = async (
  conversation: CachedConversation,
) => {
  // first check if the peer identity is cached
  let { name, avatar } = getPeerAddressIdentity(conversation);
  if (!name) {
    name = await throttledFetchAddressName(
      conversation.peerAddress as ETHAddress,
    );
  }
  if (!avatar) {
    avatar = await throttledFetchEnsAvatar({
      address: conversation.peerAddress as ETHAddress,
    });
  }
  return {
    name,
    avatar,
  };
};

/**
 * Set the peer identity of a conversation
 *
 * @param name The resolved name of the peer address
 * @param avatar The resolved avatar of the peer address
 * @param conversation The conversation to update
 * @param db DB instance
 */
export const setPeerAddressIdentity = async (
  name: string | null | undefined,
  avatar: string | null | undefined,
  conversation: CachedConversation,
  db: Dexie,
) => {
  // always use the most up-to-date conversation
  const latestConversation = await getCachedConversationByTopic(
    conversation.walletAddress,
    conversation.topic,
    db,
  );
  if (latestConversation) {
    const identity = getPeerAddressIdentity(latestConversation);
    // store peer address identity in conversation metadata
    await updateConversationMetadata(
      conversation.walletAddress,
      conversation.topic,
      "peerIdentity",
      // undefined is a special value that means we don't want to update the
      // value, but rather keep the existing value
      {
        name: name === undefined ? identity.name : name,
        avatar: avatar === undefined ? identity.avatar : avatar,
      },
      db,
    );
  }
};

/**
 * Update the peer identity of a conversation
 *
 * @param conversation The conversation to update
 * @param db DB instance
 */
export const updatePeerAddressIdentity = async (
  conversation: CachedConversation,
  db: Dexie,
) => {
  const { name, avatar } = await fetchPeerAddressIdentity(conversation);
  if (name || avatar) {
    await setPeerAddressIdentity(name, avatar, conversation, db);
  }
  return {
    name,
    avatar,
  };
};

/**
 * Given an array of conversations, lookup and update the identities of the
 * conversation peer addresses.
 */
const updateConversationIdentities = async (
  conversations: CachedConversation[],
  db: Dexie,
) => {
  // key the conversations by peer address for easy lookup
  const conversationsWithoutNameMap = conversations.reduce(
    (result, conversation) => {
      // check if conversation already has peer identity metadata
      const identity = getPeerAddressIdentity(conversation);
      // skip conversations with peer identity name
      return identity.name
        ? result
        : {
            ...result,
            [conversation.peerAddress]: conversation,
          };
    },
    {} as { [peerAddress: string]: CachedConversation },
  );
  const addressesWithoutNames = Object.keys(
    conversationsWithoutNameMap,
  ) as ETHAddress[];
  // make sure we have addresses to lookup
  if (addressesWithoutNames.length > 0) {
    // first check for UNS names first since we can do a bulk lookup
    const unsNames = await throttledFetchUnsNames(addressesWithoutNames);
    (Object.entries(unsNames) as [ETHAddress, string][]).forEach(
      ([address, name]) => {
        const conversation = conversationsWithoutNameMap[address];
        if (conversation) {
          void setPeerAddressIdentity(name, null, conversation, db);
        }
      },
    );
    const unsAddresses = Object.keys(unsNames);
    const unresolvedAddresses: ETHAddress[] = addressesWithoutNames.filter(
      (address) => !unsAddresses.includes(address),
    );
    // since there's no bulk lookup for ENS names, we batch the lookups in
    // groups of 10
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of chunkArray(unresolvedAddresses, 10)) {
      // this will yield to the event loop to prevent UI blocking
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        chunk.map(async (address) => {
          const name = await throttledFetchEnsName({ address });
          const conversation = conversationsWithoutNameMap[address];
          if (conversation) {
            await setPeerAddressIdentity(name, undefined, conversation, db);
          }
        }),
      );
    }
  }
  // key the conversations by peer address for easy lookup
  const conversationsWithoutAvatarMap = conversations.reduce(
    (result, conversation) => {
      // check if conversation already has peer identity metadata
      const identity = getPeerAddressIdentity(conversation);
      // skip conversations with peer identity name
      return identity.avatar
        ? result
        : {
            ...result,
            [conversation.peerAddress]: conversation,
          };
    },
    {} as { [peerAddress: string]: CachedConversation },
  );
  const addressesWithoutAvatars = Object.keys(
    conversationsWithoutAvatarMap,
  ) as ETHAddress[];
  // make sure we have addresses to lookup
  if (addressesWithoutAvatars.length > 0) {
    // since there's no bulk lookup for ENS avatars, we batch the lookups in
    // groups of 10
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of chunkArray(addressesWithoutAvatars, 10)) {
      // this will yield to the event loop to prevent UI blocking
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        chunk.map(async (address) => {
          let avatar: string | null = null;
          avatar = await throttledFetchEnsAvatar({ address });
          const conversation = conversationsWithoutAvatarMap[address];
          if (conversation) {
            await setPeerAddressIdentity(undefined, avatar, conversation, db);
          }
        }),
      );
    }
  }
};

export const throttledUpdateConversationIdentities = memoizeThrottle(
  updateConversationIdentities,
  API_FETCH_THROTTLE,
  undefined,
  (conversations: CachedConversation[]) =>
    conversations.map((c) => c.peerAddress).join(","),
);
