import React from "react";
import { Image } from "../Images/Image";
import { InfoCardIcon } from "../InfoCard/iconMapping";
import { InfoCard } from "../InfoCard/InfoCard";

interface LearnMoreProps {
  highlightedCompanies?: Array<{
    name: string;
    description: string;
    tags: React.ReactNode;
  }>;
  version: string;
  setStartedFirstMessage: () => void;
}

export const LearnMore = ({
  highlightedCompanies = [],
  version,
  setStartedFirstMessage,
}: LearnMoreProps) => (
  <div className="flex flex-col justify-center items-center max-w-xl p-4 md:h-screen m-0 m-auto">
    <div>
      <h1 className="text-4xl font-bold my-4" data-testId="learn-more-header">
        Learn more about the XMTP Universe
      </h1>
    </div>
    <div className="flex flex-col md:flex-row w-full">
      {highlightedCompanies.map(({ name, description, tags }) => {
        return (
          <div className="flex" key={name}>
            <div className="flex flex-col max-w-sm p-2">
              <Image src="https://picsum.photos/350/150" alt="Company 1" />
              <h2 className="text-lg font-extrabold">{name}</h2>
              <p className="text-md">{description}</p>
              <div className="flex justify-start">{tags}</div>
            </div>
          </div>
        );
      })}
    </div>
    <div>
      <h2 className="text-lg font-bold my-4" data-testId="get-started-header">
        Let&apos;s get started!
      </h2>
      <InfoCard
        header="Send a new message"
        subtext="Find an existing contact or message someone using their wallet address or ENS address"
        leftIcon={InfoCardIcon.NEW_MESSAGE}
        onClick={setStartedFirstMessage}
        testId="message"
      />
      <InfoCard
        header="Check out the XMTP gallery"
        subtext="We showcase teams and projects who have used the XMTP protocol to power their apps"
        leftIcon={InfoCardIcon.GALLERY}
        styles={"border-t-0"}
        testId="community"
        url="https://community.xmtp.org"
      />
      <InfoCard
        header="Are you a builder?"
        subtext="Check out the documentation for our protocol and find out how to get up and running quickly"
        leftIcon={InfoCardIcon.DOCUMENTATION}
        styles={"border-t-0"}
        testId="docs"
        url="https://docs.xmtp.org"
      />
    </div>
    <span className="text-sm w-full" data-testId="xmtp-version">
      Version {version}
    </span>
  </div>
);
