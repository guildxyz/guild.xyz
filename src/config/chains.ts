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
  Register["config"]["chains"][number]["id"],
  {
    name: string;
    icon: string;
  }
>;
