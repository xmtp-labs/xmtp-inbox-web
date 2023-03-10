import React from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import SideNav from "../component-library/components/SideNav/SideNav";
import useDisconnectWallet from "../hooks/useDisconnectWallet";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";

export const SideNavWrapper = () => {
  const client = useXmtpStore((state) => state.client);

  const { onDisconnect } = useDisconnectWallet();

  const { data: ensNameConnectedWallet } = useEnsName({
    address: client?.address as address,
  });

  const { data: selfAvatarUrl } = useEnsAvatar({
    address:
      (ensNameConnectedWallet as address) ?? (client?.address as address),
  });

  return (
    <SideNav
      onDisconnect={() => onDisconnect(client?.address as address)}
      displayAddress={ensNameConnectedWallet ?? client?.address}
      walletAddress={ensNameConnectedWallet ? client?.address : undefined}
      avatarUrl={selfAvatarUrl || ""}
    />
  );
};
