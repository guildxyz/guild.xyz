import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { Question } from "phosphor-react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { UniswapChains } from "requirements/Uniswap/hooks/useParsePoolChain"
import { useSymbolsOfPair } from "requirements/Uniswap/hooks/useSymbolsOfPair"
import { PlatformType } from "types"
import { Chains } from "wagmiConfig/chains"
import { LiquidityIncentiveForm } from "../LiquidityIncentiveSetupModal"
import LiquidityConversion from "./LiquidityConversion"
import SelectPointType from "./SelectPointType"

const SetPointsReward = ({ onSubmit }: { onSubmit: () => Promise<void> }) => {
  const { setValue } = useFormContext<LiquidityIncentiveForm>()

  const { guildPlatforms } = useGuild()
  const numOfPointsPlatforms = guildPlatforms
    ? guildPlatforms.filter((gp) => gp.platformId === PlatformType.POINTS).length
    : 0

  const conversion = useWatch({ name: `conversion` })
  const pointsPlatformId = useWatch({ name: "pointsId" })

  const isConversionDisabled = numOfPointsPlatforms
    ? pointsPlatformId === null
    : false
  const isSubmitDisabled = isConversionDisabled || !conversion

  const [isLoading, setIsLoading] = useState(false)

  const chain: UniswapChains = useWatch({
    name: `pool.chain`,
  })

  const baseCurrency: "token0" | "token1" = useWatch({
    name: "pool.data.baseCurrency",
  })

  const token0 = useWatch({ name: `pool.data.token0` })
  const token1 = useWatch({ name: `pool.data.token1` })

  const { symbol0, symbol1 } = useSymbolsOfPair(Chains[chain], token0, token1)

  return (
    <Stack gap={5}>
      <Text colorScheme="gray">
        Configure the reward users will earn for providing liquidity.
      </Text>

      <FormControl>
        <Stack gap={0}>
          <HStack gap={0} mb={2}>
            <FormLabel mb={0}>Base currency</FormLabel>
            <Tooltip
              label="The reward will be calculated based on the amount of liquidity provided in the currency you select."
              hasArrow
            >
              <Icon as={Question} color="GrayText" />
            </Tooltip>
          </HStack>
          <RadioButtonGroup
            options={[
              { label: symbol0 ?? "", value: "token0" },
              { label: symbol1 ?? "", value: "token1" },
            ]}
            value={baseCurrency}
            onChange={(newValue) => setValue("pool.data.baseCurrency", newValue)}
            chakraStyles={{ size: "md" }}
          />
        </Stack>
      </FormControl>

      <Divider />
      <SelectPointType />

      <Box opacity={isConversionDisabled ? 0.5 : 1}>
        <LiquidityConversion />
      </Box>

      <Button
        colorScheme={"indigo"}
        onClick={async () => {
          setIsLoading(true)
          await onSubmit()
          setIsLoading(false)
        }}
        mb={5}
        mt={3}
        isDisabled={isSubmitDisabled}
        isLoading={isLoading}
      >
        Save
      </Button>
    </Stack>
  )
}

export default SetPointsReward
