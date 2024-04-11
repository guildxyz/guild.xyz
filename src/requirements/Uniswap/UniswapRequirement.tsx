import { HStack, Skeleton } from "@chakra-ui/react"
import { Schemas, consts } from "@guildxyz/types"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import REQUIREMENTS from "requirements"
import { Chains } from "wagmiConfig/chains"
import { useSymbolsOfPair } from "./hooks/useSymbolsOfPair"

const UniswapRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const {
    chain,
    data: { token0, token1, maxAmount, minAmount },
  } = useRequirementContext() as Extract<
    Schemas["Requirement"],
    { type: "UNISWAP_V3_POSITIONS" }
  >

  const { symbol0, symbol1 } = useSymbolsOfPair(
    Chains[chain],
    token0 as `0x${string}`,
    token1 as `0x${string}`
  )

  return (
    <Requirement
      image={REQUIREMENTS.UNISWAP_V3_POSITIONS.icon.toString()}
      footer={
        <HStack>
          <RequirementChainIndicator />
          <BlockExplorerUrl address={consts.UniswapV3PositionsAddresses[chain]} />
        </HStack>
      }
      {...rest}
    >
      Hold{" "}
      {maxAmount
        ? `${minAmount} - ${maxAmount}`
        : minAmount > 0
        ? `at least ${minAmount}`
        : "any amount of"}{" "}
      <Skeleton isLoaded={!!symbol0 && !!symbol1} display={"inline"}>
        <DataBlock>
          {symbol0 ?? "___"}/{symbol1 ?? "___"}
        </DataBlock>
      </Skeleton>{" "}
      LP tokens
    </Requirement>
  )
}

export default UniswapRequirement
