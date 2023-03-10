import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AddressInput } from "./AddressInput";

export default {
  title: "AddressInput",
  component: AddressInput,
  argTypes: {
    variant: { control: false },
    isDisabled: { control: false },
    avatarUrlProps: { control: false },
  },
} as ComponentMeta<typeof AddressInput>;

const Template: ComponentStory<typeof AddressInput> = (args) => (
  <AddressInput {...args} />
);

export const AddressInputDefault = Template.bind({});
AddressInputDefault.args = {
  subtext: "Please enter a valid wallet address",
};

export const AddressInputResolvedAddress = Template.bind({});
AddressInputResolvedAddress.args = {
  resolvedAddress: {
    displayAddress: "hi.xmtp.eth",
    walletAddress: "0x194c31cAe1418D5256E8c58e0d08Aee1046C6Ed0",
  },
};

export const AddressInputLoading = Template.bind({});
AddressInputLoading.args = {
  subtext: "Fetching ENS address...",
  isLoading: true,
};

export const AddressInputError = Template.bind({});
AddressInputError.args = {
  subtext: "Error fetching address",
  isError: true,
};
