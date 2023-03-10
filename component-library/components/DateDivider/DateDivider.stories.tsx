import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DateDivider } from "./DateDivider";

export default {
  title: "DateDivider",
  component: DateDivider,
} as ComponentMeta<typeof DateDivider>;

const Template: ComponentStory<typeof DateDivider> = () => (
  <DateDivider date={new Date()} />
);

export const DateDividerDefault = Template.bind({});
DateDividerDefault.args = {};
