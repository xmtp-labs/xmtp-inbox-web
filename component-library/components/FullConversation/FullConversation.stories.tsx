import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { FullConversation } from "./FullConversation";
import { FullMessage } from "../FullMessage/FullMessage";

export default {
  title: "FullConversation",
  component: FullConversation,
  argTypes: {},
} as ComponentMeta<typeof FullConversation>;

const Template: ComponentStory<typeof FullConversation> = (args) => (
  <div className="h-full">
    <FullConversation {...args} />
  </div>
);

const fromProps = {
  text: "This should be a from message. Here is my super, super, super interesting from message. What do you think?",
  from: {
    displayAddress: "hi.xmtp.eth",
    isSelf: true,
  },
  datetime: new Date(),
};

const toProps = {
  text: "This should be a to message. Here is my super, super, super interesting to message. What do you think?",
  from: {
    displayAddress: "otherperson.xmtp.eth",
    isSelf: false,
  },
  datetime: new Date(),
};

export const FullConversationNoMessages = Template.bind({});
FullConversationNoMessages.args = {
  messages: [],
};

export const FullConversationWithMessages = Template.bind({});
FullConversationWithMessages.args = {
  messages: Array(20).fill(
    <div>
      <FullMessage {...fromProps} />
      <FullMessage {...toProps} />
    </div>,
  ),
};

export const FullConversationLoading = Template.bind({});
FullConversationLoading.args = {
  messages: [],
  isLoading: true,
};
