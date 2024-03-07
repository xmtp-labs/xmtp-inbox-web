import xmtpIconUrl from "../../../images/xmtp-icon.png";

const LinkEle = ({ url, text }: { url: string; text: string }) => (
  <a
    href={url}
    target="_blank"
    className="text-indigo-600 m-1 pb-4 cursor-pointer font-bold"
    rel="noreferrer">
    {text}
  </a>
);

export const Mobile = () => (
  <div className="flex flex-col items-center justify-center inset-0 fixed p-8 text-center">
    <div className="flex flex-col w-full items-center">
      <img src={xmtpIconUrl} alt="XMTP logo" className="h-24 w-24 mb-4" />
      <h1 className="text-3xl font-bold">Looks like you&apos;re on mobile!</h1>
    </div>
    <p className="text-left mt-4 font-bold">For mobile-friendly chat:</p>
    <ul>
      <li className="mt-4">
        Try group chat on the dev network in Converse Preview:
      </li>
      <LinkEle url="https://testflight.apple.com/join/xEJOvzEx" text="iOS" />
      |
      <LinkEle
        url="https://drive.google.com/file/d/1rUtCmtIB6VzHNW8PDJ1TMBRuI2OEOdcg/view?usp=drive_link"
        text="Android"
      />
      <li className="mt-4">
        Try subscription notifications and 1:1 chats in
        <LinkEle url="https://go.cb-w.com" text="Coinbase Wallet" />
      </li>
      <li className="mt-4">
        Devs, build on the open source
        <LinkEle
          url="https://github.com/xmtp-labs/xmtp-inbox-mobile"
          text="XMTP React Native Reference App"
        />
      </li>
    </ul>
  </div>
);
