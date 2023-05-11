import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentTypeGroupChatMemberRemoved: ContentTypeId = {
  typeId: "groupChatMemberRemoved",
  authorityId: "pat.xmtp.com",
  versionMajor: 1,
  versionMinor: 0,
  sameAs(id) {
    return (
      this.typeId === id.typeId &&
      this.authorityId === id.authorityId &&
      this.versionMajor === id.versionMajor &&
      this.versionMinor === id.versionMinor
    );
  },
};

export type GroupChatMemberRemoved = {
  removedMember: string;
  remover: string;
  newSharedKey: string;
};

export class GroupChatMemberRemovedCodec
  implements ContentCodec<GroupChatMemberRemoved>
{
  contentType = ContentTypeGroupChatMemberRemoved;

  encode(content: GroupChatMemberRemoved): EncodedContent {
    return {
      type: ContentTypeGroupChatMemberRemoved,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    };
  }

  decode(encodedContent: EncodedContent): GroupChatMemberRemoved {
    const json = new TextDecoder().decode(encodedContent.content);
    return JSON.parse(json);
  }
}
