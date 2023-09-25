import { Dialog, Transition } from "@headlessui/react";
import type React from "react";
import { Fragment, useEffect, useState } from "react";
import {
  ChatAlt2Icon,
  CheckCircleIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import {
  ClipboardCopyIcon,
  CogIcon,
  SparklesIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useTranslation } from "react-i18next";
import { QRCode } from "react-qrcode-logo";
import type { ETHAddress } from "../../../helpers";
import { classNames, isAppEnvDemo, shortAddress } from "../../../helpers";
import { XmtpIcon } from "../Icons/XmtpIcon";
import { Avatar } from "../Avatar/Avatar";
import { GhostButton } from "../GhostButton/GhostButton";
import { DisconnectIcon } from "../Icons/DisconnectIcon";
import i18next, { supportedLocales } from "../../../helpers/i18n";

interface SideNavProps {
  /**
   * Contents inside side nav
   */
  icon?: React.ReactNode;
  /**
   * What is the display address?
   */
  displayAddress?: string;
  /**
   * What is the wallet address?
   */
  walletAddress?: ETHAddress;
  /**
   * What is the avatarUrl?
   */
  avatarUrl?: string;
  /**
   * What should happen when disconnect is clicked?
   */
  onDisconnect?: () => void;
}

type Lang = {
  displayText: string | undefined;
  isSelected: boolean;
  lang: string;
};

const SideNav = ({
  icon = <XmtpIcon />,
  displayAddress,
  walletAddress,
  avatarUrl,
  onDisconnect,
}: SideNavProps) => {
  const [mappedLangs, setMappedLangs] = useState<Lang[]>([]);
  // When language changes, change the modal text to render the corresponding locale selector within that language
  useEffect(() => {
    const langs = supportedLocales.map((locale: string) => {
      const lang = locale?.split("-")?.[0] || "en";
      const languageNames = new Intl.DisplayNames([i18next.language], {
        type: "language",
      });

      return {
        displayText: languageNames.of(lang),
        isSelected: i18next.language === lang,
        lang,
      };
    });
    setMappedLangs(langs);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);

  const onSideNavBtnClick = (key: string) => {
    if (key === t("menu.collapse_header")) setIsOpen(!isOpen);
  };

  const onXmtpIconClick = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const icons = [
    <ChatAlt2Icon
      key={t("menu.messages_header")}
      width={24}
      className={isOpen ? "mr-4" : ""}
      data-testid="messages-icon"
    />,
    <SparklesIcon
      key={t("menu.gallery_header")}
      width={24}
      className={isOpen ? "mr-4" : ""}
      data-testid="gallery-icon"
    />,
    <CogIcon
      key={t("menu.settings_header")}
      width={24}
      className={isOpen ? "mr-4" : ""}
      data-testid="settings-icon"
    />,
    <ChevronDoubleRightIcon
      key={t("menu.collapse_header")}
      width={24}
      className={isOpen ? "mr-4 rotate-180" : ""}
      data-testid="collapse-icon"
    />,
  ];
  const [currentIcon, setCurrentIcon] = useState(icons[0].key);

  const mappedButtons = icons.map((icn) => (
    <div className="group flex relative w-full" key={icn.key}>
      <button
        type="button"
        onClick={(event) => {
          setCurrentIcon((event.target as HTMLElement).innerText);
          onSideNavBtnClick(icn.key as string);
        }}
        aria-label={icn.key as string}
        className={classNames(
          "hover:bg-gray-200",
          "p-2",
          isOpen ? "pr-8" : "",
          "hover:text-black",
          "text-gray-500",
          "rounded-lg",
          "w-full",
          "flex",
          "item-center",
          "h-fit",
          "rounded",
          "cursor-pointer",
          isOpen ? "w-[300px]" : "",
        )}>
        <div
          className={classNames(
            "flex justify-center items-center h-fit",
            currentIcon === icn.key ||
              (!currentIcon && icons[3].key === icn.key)
              ? "font-bold"
              : "",
          )}>
          {icn}
          <span data-testid={icn.key}>{isOpen && icn.key}</span>
        </div>
      </button>
      {(icn.key === t("menu.gallery_header") ||
        icn.key === t("menu.settings_header")) && (
        <div
          role="tooltip"
          className={classNames(
            "group-hover:opacity-100 w-max transition-opacity bg-gray-800 p-2 text-sm text-gray-100 rounded-md absolute opacity-0 m-4 mx-auto z-20",
            isOpen ? "left-32" : "left-10",
          )}>
          {t("menu.coming_soon")}
        </div>
      )}
    </div>
  ));

  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "justify-between",
        "items-center",
        "h-screen",
        "bg-white",
        isOpen ? "px-6" : "px-3",
        "border-r",
        "border-gray-200",
        "shadow-lg",
        !isOpen ? "w-[64px]" : "absolute w-[80vw] lg:w-full lg:relative z-50",
      )}>
      <div className="flex flex-col items-start space-y-4 w-full">
        <div className="py-4 flex w-full">
          <div className="w-full">
            <div className="flex mb-12 items-center">
              <Avatar url={avatarUrl} address={walletAddress} />
              {isOpen && (
                <div className="flex items-center">
                  <div className="flex flex-col px-2 justify-center">
                    <span className="font-bold" data-testid="wallet-address">
                      {displayAddress ? shortAddress(displayAddress) : ""}
                    </span>
                    {walletAddress && displayAddress !== walletAddress && (
                      <button
                        type="button"
                        className="font-sm"
                        onClick={() => {
                          void navigator.clipboard.writeText(walletAddress);
                        }}>
                        {shortAddress(walletAddress)}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start pt-4 space-y-4">
              {mappedButtons}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center font-bold w-full pb-8">
        <div
          role="button"
          onClick={onXmtpIconClick}
          onKeyDown={onXmtpIconClick}
          tabIndex={0}
          className="cursor-pointer"
          data-testid="icon">
          {icon}
        </div>
      </div>
      <Transition.Root show={isQrCodeDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={onXmtpIconClick}
          aria-label={t("menu.settings") || ""}>
          <div
            data-testid="share-qr-modal"
            className="bg-[#ffffffa3] w-[100vw] h-[100vh] flex items-center justify-center absolute top-0 z-20">
            <div className="bg-[url('/shareQrBg.png')] bg-repeat-round m-4 lg:w-[35%] sm:w-[90%] md:w-[50%] h-[90vh] text-white flex flex-col items-center p-4 rounded-3xl drop-shadow-lg">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsQrCodeDialogOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsQrCodeDialogOpen(false);
                  }
                }}
                className="w-[100%] flex justify-end cursor-pointer mb-20">
                <XIcon width={24} />
              </div>
              <div className="h-8">
                <img
                  className="h-[100%]"
                  alt="xmtp-logo"
                  src="/xmtp-logo.png"
                />
              </div>
              <div className="text-center p-4 pb-6">
                {t("common.share_code")}
              </div>
              <div className="p-4 flex items-center justify-center rounded-3xl bg-white">
                <QRCode
                  size={200}
                  logoImage="/xmtp-icon.png"
                  removeQrCodeBehindLogo
                  logoPadding={10}
                  value={`${window.location.origin}/dm/${walletAddress ?? ""}`}
                />
              </div>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void navigator.clipboard.writeText(
                      `${window.location.origin}/dm/${walletAddress ?? ""}`,
                    );
                  }
                }}
                onClick={() => {
                  void navigator.clipboard.writeText(
                    `${window.location.origin}/dm/${walletAddress ?? ""}`,
                  );
                }}
                className="flex text-sm mt-5 cursor-pointer">
                <span data-testid="share-qr-link" className="underline">
                  {t("common.share_link")}
                </span>
                <ClipboardCopyIcon className="ml-2" width={16} />
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={isDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={onXmtpIconClick}
          aria-label={t("menu.settings") || ""}>
          <div className="bg-gray-50 w-fit rounded-lg absolute bottom-16 left-12 p-2 z-50">
            <div className="max-h-80 overflow-auto">
              {mappedLangs.map(({ displayText, isSelected, lang }) => (
                <div className="flex p-2 justify-between" key={lang}>
                  <button
                    type="button"
                    onClick={() => {
                      void i18next.changeLanguage(lang);
                      onXmtpIconClick();
                    }}
                    className={classNames(
                      "text-sm",
                      isSelected ? "font-bold" : "",
                    )}>
                    {displayText}
                  </button>
                  {isSelected && (
                    <CheckCircleIcon
                      width="16"
                      fill="limegreen"
                      className="ml-4"
                    />
                  )}
                </div>
              ))}
            </div>
            <hr className="m-2" />
            {!isAppEnvDemo() && (
              <>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setIsQrCodeDialogOpen(true);
                    setIsDialogOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsQrCodeDialogOpen(true);
                      setIsDialogOpen(false);
                    }
                  }}
                  data-testid="share-qr"
                  className="text-sm ml-2 cursor-pointer text-indigo-600 hover:text-indigo-800">
                  {t("common.share_qr_code")}
                </span>
                <hr className="m-2" />
              </>
            )}

            <span className="text-sm ml-2 text-red-600 hover:text-red-800">
              <a
                href="https://github.com/xmtp-labs/xmtp-inbox-web/issues/new?assignees=&labels=bug&template=bug_report.yml&title=Bug%3A+"
                target="_blank"
                rel="noreferrer">
                {t("common.report_bug")}
              </a>
            </span>
            <hr className="m-2" />
            <GhostButton
              onClick={onDisconnect}
              label={t("common.disconnect")}
              variant="secondary"
              size="small"
              testId="disconnect-wallet-cta"
              icon={<DisconnectIcon />}
            />
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default SideNav;
