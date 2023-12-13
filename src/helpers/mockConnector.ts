import { MockConnector } from "@wagmi/core/connectors/mock";
import walletClient from "./createRandomWallet";

localStorage.setItem("demoWalletAddress", walletClient.account.address);

// mock connector for demos
export const mockConnector = new MockConnector({
  options: {
    walletClient,
  },
});
