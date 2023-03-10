import { useRouter } from "next/router";
import { useDisconnect } from "wagmi";
import { wipeKeys } from "../helpers";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";

const useDisconnectWallet = () => {
  const { disconnect: disconnectWagmi, reset: resetWagmi } = useDisconnect();
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const router = useRouter();

  const onDisconnect = (address: address) => {
    wipeKeys(address ?? "");
    disconnectWagmi();
    resetWagmi();
    resetXmtpState();
    router.push("/");
  };

  return {
    onDisconnect,
  };
};

export default useDisconnectWallet;
