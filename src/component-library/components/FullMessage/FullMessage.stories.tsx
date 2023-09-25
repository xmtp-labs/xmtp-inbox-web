import type { ComponentStory, ComponentMeta } from "@storybook/react";
import type { RemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { FullMessage } from "./FullMessage";
import { shortAddress } from "../../../helpers";
import { getMockMessage } from "../../../helpers/mocks";

export default {
  title: "FullMessage",
  component: FullMessage,
  argTypes: {
    text: { control: "text", defaultValue: "Hello!" },
    from: { control: false },
    datetime: { control: false },
  },
} as ComponentMeta<typeof FullMessage>;

const Template: ComponentStory<typeof FullMessage> = (args) => (
  <FullMessage {...args} />
);

export const FullOutgoingMessage = Template.bind({});
FullOutgoingMessage.args = {
  message: getMockMessage(1, {
    content: "Hello there",
    senderAddress: "sender",
    walletAddress: "receiver",
  }),
  from: {
    displayAddress: "hi.xmtp.eth",
    isSelf: true,
  },
  datetime: new Date(),
};

export const FullIncomingMessage = Template.bind({});
FullIncomingMessage.args = {
  message: getMockMessage(1, {
    content: "Hello there",
    senderAddress: "receiver",
    walletAddress: "sender",
  }),
  from: {
    displayAddress: shortAddress("0x194c31cAe1418D5256E8c58e0d08Aee1046C6Ed0"),
    isSelf: false,
  },
  datetime: new Date(),
};

const remoteAttachment: RemoteAttachment = {
  url: "url",
  contentDigest: "",
  salt: new Uint8Array(),
  nonce: new Uint8Array(),
  secret: new Uint8Array(),
  scheme: "",
  contentLength: 1,
  filename: "filename",
};

export const FullIncomingMessageAttachment = Template.bind({});
FullIncomingMessageAttachment.args = {
  message: getMockMessage(1, {
    content: remoteAttachment,
    senderAddress: "receiver",
    walletAddress: "sender",
  }),
  from: {
    displayAddress: "another.xmtp.eth",
    isSelf: false,
  },
  datetime: new Date(),
};

export const FullIncomingAttachmentError = Template.bind({});
FullIncomingAttachmentError.args = {
  message: getMockMessage(1, {
    hasLoadError: true,
    content: remoteAttachment,
    senderAddress: "receiver",
    walletAddress: "sender",
  }),
  from: {
    displayAddress: "another.xmtp.eth",
    isSelf: false,
  },
  datetime: new Date(),
};
