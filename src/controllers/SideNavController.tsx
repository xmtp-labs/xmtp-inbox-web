import { useDisconnect } from "wagmi";
import { useClient } from "@xmtp/react-sdk";
import SideNav from "../component-library/components/SideNav/SideNav";
import type { ETHAddress } from "../helpers";
import { wipeKeys } from "../helpers";
import { useXmtpStore } from "../store/xmtp";

export const SideNavController = () => {
  const { client, disconnect } = useClient();
  const resetXmtpState = useXmtpStore((s) => s.resetXmtpState);
  const clientName = useXmtpStore((s) => s.clientName);
  const clientAvatar = useXmtpStore((s) => s.clientAvatar);
  const { disconnect: disconnectWagmi, reset: resetWagmi } = useDisconnect();

  return (
    <SideNav
      displayAddress={clientName ?? client?.address}
      walletAddress={client?.address as ETHAddress | undefined}
      avatarUrl={clientAvatar || ""}
      onDisconnect={() => {
        void disconnect();
        wipeKeys(client?.address ?? "");
        disconnectWagmi();
        resetWagmi();
        resetXmtpState();
      }}
    />
  );
};
