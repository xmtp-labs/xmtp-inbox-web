import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js"
import { CodecRegistry } from "@xmtp/xmtp-js/dist/types/src/MessageContent"

export const ContentTypeReaction = new ContentTypeId({
  authorityId: 'xmtp.org',
  typeId: 'reaction',
  versionMajor: 1,
  versionMinor: 0
})

export type Reaction = {
  reactingToID: string,
  emoji: string
}

export class ReactionCodec implements ContentCodec<Reaction> {
  get contentType(): ContentTypeId {
    return ContentTypeReaction
  }

  encode(content: Reaction, registry: CodecRegistry): EncodedContent {
    if (!/\p{Extended_Pictographic}/u.test(content.emoji)) {
      throw new Error('emoji is not valid')
    }

    return {
      type: ContentTypeReaction,
      parameters: {
        reactingToID: content.reactingToID,
      },
      content: new TextEncoder().encode(content.emoji)
    }
  }

  decode(content: EncodedContent, registry: CodecRegistry): Reaction {
    return {
      reactingToID: content.parameters.reactingToID,
      emoji: new TextDecoder().decode(content.content)
    }
  }
}