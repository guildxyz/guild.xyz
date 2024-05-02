import { HStack, Skeleton } from "@chakra-ui/react"
import { Schemas, consts } from "@guildxyz/types"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import REQUIREMENTS from "requirements"
import { Chains } from "wagmiConfig/chains"
import { useSymbolsOfPair } from "./hooks/useSymbolsOfPair"

const UNISWAP_TESTNETS = new Set<(typeof consts.UniswapV3PositionsChains)[number]>([
  "SEPOLIA",
  "BASE_SEPOLIA",
])

// These are the chains, which Uniswapp calls differently then us
const UniswapQueryChainNames = {
  BASE_MAINNET: "base",
  BSC: "bnb",
  BLAST_MAINNET: "blast",
} as const satisfies Partial<
  Record<(typeof consts.UniswapV3PositionsChains)[number], string>
>

const UniswapRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const {
    chain,
    data: {
      token0,
      token1,
      maxAmount,
      minAmount,
      baseCurrency,
      countedPositions,
      defaultFee,
    },
    roleId,
    id,
  } = useRequirementContext() as Extract<
    Schemas["Requirement"],
    { type: "UNISWAP_V3_POSITIONS" }
  >

  const { symbol0, symbol1 } = useSymbolsOfPair(
    Chains[chain],
    token0 as `0x${string}`,
    token1 as `0x${string}`
  )

  const baseSymbol = baseCurrency === "token0" ? symbol0 : symbol1

  const chainQueryParam = UniswapQueryChainNames[chain] ?? chain.toLowerCase()

  const { reqAccesses } = useRoleMembership(roleId)

  const hasAccess = reqAccesses?.find(
    ({ requirementId }) => requirementId === id
  )?.access

  return (
    <Requirement
      image={REQUIREMENTS.UNISWAP_V3_POSITIONS.icon.toString()}
      footer={
        <HStack>
          <RequirementChainIndicator />
          {/* The Uniswap app didn't seem able to handle testnets in the query param */}
          {!hasAccess && !UNISWAP_TESTNETS.has(chain) && (
            <RequirementLinkButton
              href={`https://app.uniswap.org/add/${token0}/${token1}${
                defaultFee ? `/${defaultFee}` : ""
              }?chain=${chainQueryParam}`}
              imageUrl={REQUIREMENTS.UNISWAP_V3_POSITIONS.icon.toString()}
              leftIcon={null}
              rightIcon={null}
              colorScheme={"UNISWAP"}
              color={"white"}
              variant={"solid"}
            >
              Add Liquidity
            </RequirementLinkButton>
          )}
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
      <Skeleton isLoaded={!!baseSymbol} display={"inline"}>
        <DataBlock>{baseSymbol ?? "___"}</DataBlock>
      </Skeleton>{" "}
      value of{" "}
      <Skeleton isLoaded={!!symbol0 && !!symbol1} display={"inline"}>
        <DataBlock>
          {symbol0 ?? "___"}/{symbol1 ?? "___"}
        </DataBlock>
      </Skeleton>{" "}
      {countedPositions === "IN_RANGE" ? "in-range " : ""}
      {countedPositions === "FULL_RANGE" ? "full-range " : ""}
      positions on Uniswap v3
    </Requirement>
  )
}

export default UniswapRequirement
