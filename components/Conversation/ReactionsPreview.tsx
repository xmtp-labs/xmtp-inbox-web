import { Tab } from "@headlessui/react";
import Blockies from "react-blockies";
import { useAccount } from "wagmi";
import { shortAddress } from "../../helpers";

type Props = {
  isMyMessage: boolean;
  reactions: { reactingToID: string; emoji: string; senderAddress: string }[];
};

interface PreviewItemProps {
  address: string;
  emoji: string;
}

const PreviewItem = ({ address, emoji }: PreviewItemProps) => {
  const { address: myAddress } = useAccount();
  return (
    <div className="flex items-center justify-between w-full cursor-pointer hover:bg-black hover:bg-opacity-5 px-[10px] py-[6px] rounded-lg translate-all duration-300">
      <div className="flex items-center gap-[14px]">
        <Blockies
          seed={address.toLowerCase()}
          className="h-[40px] w-[40px] min-w-[40px] min-h-[40px] object-cover rounded-full"
        />
        <span className="text-black text-lg md:text-md font-bold place-self-start font-mono my-auto">
          {address === myAddress ? "You" : shortAddress(address)}
        </span>
      </div>
      <span>{emoji}</span>
    </div>
  );
};

const ReactionsPreview = ({ isMyMessage, reactions }: Props) => {
  const classNames = (...classes: string[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <div
      className={classNames(
        isMyMessage
          ? "sm400:right-[55px] right-[19px]"
          : "sm450:right-0 right-[43px]",
        "bg-white text-sidebarLink min-w-[345px] sm400:min-w-[365px] shadow border flex flex-col items-center relative rounded-[16px] pb-[6px]",
      )}>
      <Tab.Group>
        <div className="pt-[6px] px-[8px] w-full">
          <Tab.List className="flex">
            <Tab
              className={({ selected }) =>
                classNames(
                  "min-w-[62.5px] min-h-[48px] flex flex-col items-center justify-evenly border-b-[4px] border-b-p-600 transition-all duration-300 rounded outline-none",
                  selected ? "border-opacity-100" : "border-opacity-0",
                )
              }>
              <div className="font-normal flex items-center gap-1 text-black">
                <span>All</span>
                <span>{reactions?.length}</span>
              </div>
            </Tab>
            {reactions.slice(0, 2).map((reaction, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  classNames(
                    "min-w-[62.5px] min-h-[48px] flex flex-col items-center justify-evenly border-b-[4px] border-b-p-600 transition-all duration-300 rounded outline-none",
                    selected ? "border-opacity-100" : "border-opacity-0",
                  )
                }>
                <div className="font-normal flex items-center gap-1 text-black">
                  <span>{reaction?.emoji}</span>
                  <span>1</span>
                </div>
              </Tab>
            ))}
          </Tab.List>
        </div>
        <div className="pt-[6px] max-h-[296px] min-h-[150px] w-full">
          <Tab.Panels>
            <div className="flex flex-col w-full px-[8px]">
              <Tab.Panel>
                {reactions.slice(0, 2).map((reaction, index) => (
                  <PreviewItem
                    key={index}
                    emoji={reaction?.emoji}
                    address={reaction?.senderAddress}
                  />
                ))}
              </Tab.Panel>
              <Tab.Panel>
                <PreviewItem
                  emoji={reactions[0]?.emoji}
                  address={reactions[0]?.senderAddress}
                />
              </Tab.Panel>
              {reactions.length > 1 && (
                <Tab.Panel>
                  <PreviewItem
                    emoji={reactions[1]?.emoji}
                    address={reactions[1]?.senderAddress}
                  />
                </Tab.Panel>
              )}
            </div>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default ReactionsPreview;
