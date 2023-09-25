import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { FullConversation } from "./FullConversation";
import { FullMessage } from "../FullMessage/FullMessage";
import { getMockMessage } from "../../../helpers/mocks";

export default {
  title: "FullConversation",
  component: FullConversation,
  argTypes: {
    messages: { control: false },
  },
} as ComponentMeta<typeof FullConversation>;

const Template: ComponentStory<typeof FullConversation> = (args) => (
  <div className="h-full">
    <FullConversation {...args} />
  </div>
);

const mockMessageFrom = getMockMessage(1, {
  content:
    "This should be a from message. Here is my super, super, super interesting from message. What do you think?",
  senderAddress: "sender",
  walletAddress: "receiver",
});

const mockMessageTo = getMockMessage(2, {
  content:
    "This should be a to message. Here is my super, super, super interesting to message. What do you think?",
  senderAddress: "receiver",
  walletAddress: "sender",
});

export const FullConversationNoMessages = Template.bind({});
FullConversationNoMessages.args = {
  messages: [],
};

export const FullConversationWithMessages = Template.bind({});
FullConversationWithMessages.args = {
  messages: Array(20).fill(
    <div>
      <FullMessage
        message={mockMessageFrom}
        datetime={mockMessageFrom.sentAt}
        from={{ isSelf: false, displayAddress: "receiver" }}
      />
      <FullMessage
        message={mockMessageTo}
        datetime={mockMessageTo.sentAt}
        from={{ isSelf: true, displayAddress: "sender" }}
      />
    </div>,
  ),
};

export const FullConversationLoading = Template.bind({});
FullConversationLoading.args = {
  messages: [],
  isLoading: true,
};
