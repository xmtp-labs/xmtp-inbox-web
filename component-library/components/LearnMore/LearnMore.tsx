import React from "react";
import { Image } from "../Images/Image";
import { InfoCardIcon } from "../InfoCard/iconMapping";
import { InfoCard } from "../InfoCard/InfoCard";
import { TagIcon } from "../Tags/iconMapping";
import { Tag } from "../Tags/Tag";

export const LearnMore = () => (
  <div className="flex flex-col justify-center items-center max-w-xl p-4 md:h-full m-0 m-auto">
    <div>
      <h1 className="text-4xl font-bold my-4">
        Learn more about the XMTP Universe
      </h1>
    </div>
    <div className="flex flex-col md:flex-row w-full">
      <div className="flex">
        <div className="flex flex-col max-w-sm p-2">
          <Image src="https://picsum.photos/350/150" alt="Company 1" />
          <h2 className="text-lg font-extrabold">FakeCompany.xyz</h2>
          <p className="text-md">
            Placeholder: The one and only fake company that does XYZ. You will
            love learning about this super interesting company.
          </p>
          <div className="flex justify-start">
            <Tag text="Messaging" icon={TagIcon.MESSAGING} />
            <Tag text="Audio" icon={TagIcon.AUDIO} />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col max-w-sm p-2">
          <Image src="https://picsum.photos/350/150" alt="Company 2" />
          <h2 className="text-lg font-extrabold">FakeCompany.xyz</h2>
          <p className="text-md">
            Placeholder: The one and only fake company that does XYZ. You will
            love learning about this super interesting company.
          </p>
          <div className="flex justify-start">
            <Tag text="Shopping" icon={TagIcon.SHOPPING} />
            <Tag text="Transactions" icon={TagIcon.TRANSACTIONS} />
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-lg font-bold my-4">Let&apos;s get started!</h2>
      <InfoCard
        header="Send a new message"
        subtext="Find an existing contact or message someone using their wallet address or ENS address"
        leftIcon={InfoCardIcon.NEW_MESSAGE}
        onClick={() => {}}
      />
      <InfoCard
        header="Check out the XMTP gallery"
        subtext="We showcase teams and projects who have used the XMTP protocol to power their apps"
        leftIcon={InfoCardIcon.GALLERY}
        onClick={() => {}}
        hideTopBorder
      />
      <InfoCard
        header="Are you a builder?"
        subtext="Check out the documentation for our protocol and find out how to get up and running quickly"
        leftIcon={InfoCardIcon.DOCUMENTATION}
        onClick={() => {}}
        hideTopBorder
      />
    </div>
    <span className="text-sm w-full">Version ##VERSION##</span>
  </div>
);
