import { HStack, Skeleton } from "@chakra-ui/react"
import { Schemas, consts } from "@guildxyz/types"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import useToken from "hooks/useToken"
import REQUIREMENTS from "requirements"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const UniswapRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const {
    chain,
    data: { token0, token1, maxAmount, minAmount },
  } = useRequirementContext() as Extract<
    Schemas["Requirement"],
    { type: "UNISWAP_V3_POSITIONS" }
  >

  const {
    data: { symbol: token0Symbol },
  } = useToken({
    address: token0 as `0x${string}`,
    chainId: Chains[chain],
  })

  const {
    data: { symbol: token1Symbol },
  } = useToken({
    address: token1 as `0x${string}`,
    chainId: Chains[chain],
  })

  const symbol0 =
    token0 === ZERO_ADDRESS
      ? CHAIN_CONFIG[chain].nativeCurrency.symbol
      : token0Symbol
  const symbol1 =
    token1 === ZERO_ADDRESS
      ? CHAIN_CONFIG[chain].nativeCurrency.symbol
      : token1Symbol

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
