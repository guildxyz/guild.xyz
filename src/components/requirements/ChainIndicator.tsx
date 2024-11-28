import { Badge } from "@/components/ui/Badge";
import { CHAINS } from "@/config/chains";
import type { Register } from "wagmi";

export const ChainIndicator = ({
  chain,
}: { chain: Register["config"]["chains"][number]["id"] }) => (
  <Badge size="sm">
    <img
      src={CHAINS[chain].icon}
      alt={CHAINS[chain].name}
      className="size-3.5"
    />
    <span>{CHAINS[chain].name}</span>
  </Badge>
);
