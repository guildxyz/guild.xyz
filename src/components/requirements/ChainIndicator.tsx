import { Badge } from "@/components/ui/Badge";
import { CHAINS, type SupportedChainID } from "@/config/chains";

export const ChainIndicator = ({ chain }: { chain: SupportedChainID }) => (
  <Badge size="sm">
    <img
      src={CHAINS[chain].icon}
      alt={CHAINS[chain].name}
      className="size-3.5"
    />
    <span>{CHAINS[chain].name}</span>
  </Badge>
);
