import { ExclamationIcon } from "@heroicons/react/solid";
import { PillButton } from "../../components/PillButton/PillButton";

interface ErrorPageProps {
  icon?: React.ReactNode;
  header?: string;
  description?: string;
  cta?: React.ReactNode;
  subtext?: string;
}

export const ErrorPage = ({
  icon = <ExclamationIcon width={"60"} className="text-red-600" />,
  header = "Something went wrong...",
  description = "Please try again",
  cta = <PillButton label="Connect again" variant="secondary" />,
  subtext = "No private keys will be shared",
}: ErrorPageProps) => {
  return (
    <div className="bg-white h-screen max-w-sm flex flex-col justify-center items-center m-auto text-center">
      {icon}
      <div className="text-4xl font-bold mb-4">{header}</div>
      {description}
      {cta}
      <div className="text-gray-300 text-sm font-bold">{subtext}</div>
    </div>
  );
};
