import { OnboardingStep } from "../../components/OnboardingStep/OnboardingStep";

interface OnboardingPageProps {
  step: number;
  isLoading?: boolean;
}

export const OnboardingPage = ({
  step = 1,
  isLoading = false,
}: OnboardingPageProps) => {
  // In the app, these props will come from page state
  return (
    <div className="bg-white w-full">
      <OnboardingStep
        step={step}
        isLoading={isLoading}
        onConnect={() => {}}
        onCreate={() => {}}
        onEnable={() => {}}
        onDisconnect={() => {}}
      />
    </div>
  );
};
