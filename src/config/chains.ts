import { mainnet, sepolia } from "viem/chains";
import type { Register } from "wagmi";

export const CHAINS = {
  [mainnet.id]: {
    name: mainnet.name,
    icon: "/chainLogos/eth.svg",
  },
  [sepolia.id]: {
    name: sepolia.name,
    icon: "/chainLogos/eth.svg",
  },
} satisfies Record<
  SupportedChainID,
  {
    name: string;
    icon: string;
  }
>;

export type SupportedChainID = Register["config"]["chains"][number]["id"];
