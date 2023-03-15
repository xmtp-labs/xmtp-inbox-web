import React from "react";
import { useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import SideNav from "../component-library/components/SideNav/SideNav";
import { wipeKeys } from "../helpers";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";

export const SideNavWrapper = () => {
  const client = useXmtpStore((state) => state.client);
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);

  const { data: ensNameConnectedWallet } = useEnsName({
    address: client?.address as address,
  });

  const { data: selfAvatarUrl } = useEnsAvatar({
    address:
      (ensNameConnectedWallet as address) ?? (client?.address as address),
  });
  const { disconnect: disconnectWagmi, reset: resetWagmi } = useDisconnect();

  return (
    <SideNav
      displayAddress={ensNameConnectedWallet ?? client?.address}
      walletAddress={ensNameConnectedWallet ? client?.address : undefined}
      avatarUrl={selfAvatarUrl || ""}
      onDisconnect={() => {
        wipeKeys(client?.address ?? "");
        disconnectWagmi();
        resetWagmi();
        resetXmtpState();
      }}
    />
  );
};
