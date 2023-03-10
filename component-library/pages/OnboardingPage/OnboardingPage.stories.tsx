import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OnboardingPage } from "./OnboardingPage";

export default {
  title: "Pages/OnboardingPage",
  component: OnboardingPage,
  argTypes: { type: { control: false } },
} as ComponentMeta<typeof OnboardingPage>;

const Template: ComponentStory<typeof OnboardingPage> = (args) => (
  <OnboardingPage {...args} />
);

export const Default = Template.bind({});
Default.args = {};
