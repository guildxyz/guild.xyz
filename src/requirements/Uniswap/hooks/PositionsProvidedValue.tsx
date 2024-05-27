import { HStack, Skeleton, Text } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { ProvidedValueDisplayProps } from "requirements"
import { Chains } from "wagmiConfig/chains"
import { useSymbolsOfPair } from "./useSymbolsOfPair"

const PositionsProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const {
    chain,
    data: { token0, token1, baseCurrency, countedPositions },
  } = requirement

  const { symbol0, symbol1 } = useSymbolsOfPair(
    Chains[chain],
    token0 as `0x${string}`,
    token1 as `0x${string}`
  )

  const baseSymbol = baseCurrency === "token0" ? symbol0 : symbol1

  return (
    <HStack wrap={"wrap"} gap={1} display={"inline"}>
      <Text display={"inline"}>Amount of </Text>
      <Skeleton isLoaded={!!baseSymbol} display={"inline"}>
        <DataBlock>{baseSymbol ?? "___"}</DataBlock>
      </Skeleton>
      <Text display={"inline"}> value of </Text>
      <Skeleton isLoaded={!!symbol0 && !!symbol1} display={"inline"}>
        <DataBlock>
          {symbol0 ?? "___"}/{symbol1 ?? "___"}
        </DataBlock>
      </Skeleton>
      <Text display={"inline"}>
        {countedPositions === "IN_RANGE" ? " in-range " : ""}
        {countedPositions === "FULL_RANGE" ? " full-range " : ""}
        positions on Uniswap v3{" "}
      </Text>
    </HStack>
  )
}

export default PositionsProvidedValue
