import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MessagesPage } from "./MessagesPage";

export default {
  title: "Pages/MessagesPage",
  component: MessagesPage,
  argTypes: { type: { control: false } },
} as ComponentMeta<typeof MessagesPage>;

const Template: ComponentStory<typeof MessagesPage> = (args) => (
  <MessagesPage {...args} />
);

export const MessagesPageEmptyMessages = Template.bind({});
MessagesPageEmptyMessages.args = {
  type: "empty",
};

export const MessagesPageComposeNewMessages = Template.bind({});
MessagesPageComposeNewMessages.args = {
  type: "compose_new",
};

export const MessagesPageFindingEnsNoMessages = Template.bind({});
MessagesPageFindingEnsNoMessages.args = {
  type: "finding_ens_no_messages",
};

export const MessagesPageResolvedEnsNoMessages = Template.bind({});
MessagesPageResolvedEnsNoMessages.args = {
  type: "resolved_ens_no_messages",
};

export const MessagesPageFindingEnsWithMessages = Template.bind({});
MessagesPageFindingEnsWithMessages.args = {
  type: "finding_ens_with_messages",
};

export const MessagesPageResolvedEnsWithMessages = Template.bind({});
MessagesPageResolvedEnsWithMessages.args = {
  type: "resolved_ens_with_messages",
};

export const MessagesPageShortHistory = Template.bind({});
MessagesPageShortHistory.args = {
  type: "short_history",
};

export const MessagesPageLongHistory = Template.bind({});
MessagesPageLongHistory.args = {
  type: "long_history",
};

export const MessagesPageIndividualConversationLoading = Template.bind({});
MessagesPageIndividualConversationLoading.args = {
  type: "convo_loading",
};

export const MessagesPageFullPageLoading = Template.bind({});
MessagesPageFullPageLoading.args = {
  type: "page_loading",
};

export const MessagesPageProfileDropdownExpanded = Template.bind({});
MessagesPageProfileDropdownExpanded.args = {
  type: "profile_dropdown",
};

export const MessagesPageTooltipExpanded = Template.bind({});
MessagesPageTooltipExpanded.args = {
  type: "expanded_tooltip",
};
