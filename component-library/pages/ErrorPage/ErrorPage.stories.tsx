import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ErrorPage } from "./ErrorPage";

export default {
  title: "Pages/ErrorPage",
  component: ErrorPage,
  argTypes: { icon: { control: false }, cta: { control: false } },
} as ComponentMeta<typeof ErrorPage>;

const Template: ComponentStory<typeof ErrorPage> = (args) => (
  <ErrorPage {...args} />
);

export const Default = Template.bind({});
Default.args = {};
