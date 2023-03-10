import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FullMessage } from "./FullMessage";
import { shortAddress } from "../../../helpers";

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
  text: "Heyyyyyy there",
  from: {
    displayAddress: "hi.xmtp.eth",
    isSelf: true,
  },
  datetime: new Date(),
};

export const FullIncomingMessage = Template.bind({});
FullIncomingMessage.args = {
  text: "Heyyyyyy there",
  from: {
    displayAddress: shortAddress("0x194c31cAe1418D5256E8c58e0d08Aee1046C6Ed0"),
    isSelf: false,
  },
  datetime: new Date(),
};
