import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { Question } from "@phosphor-icons/react/Question"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { useFormContext, useWatch } from "react-hook-form"
import { useSymbolsOfPair } from "requirements/Uniswap/hooks/useSymbolsOfPair"
import { PlatformType } from "types"
import { Chains } from "wagmiConfig/chains"
import { LiquidityIncentiveForm } from "../LiquidityIncentiveSetupModal"
import LiquidityConversion from "./LiquidityConversion"
import SelectPointType from "./SelectPointType"

const SetLiquidityPointsRewardStep = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: () => Promise<void>
  isLoading: boolean
}) => {
  const { setValue, control } = useFormContext<LiquidityIncentiveForm>()

  const { guildPlatforms } = useGuild()
  const numOfPointsPlatforms = guildPlatforms
    ? guildPlatforms.filter((gp) => gp.platformId === PlatformType.POINTS).length
    : 0

  const conversion = useWatch({ name: `conversion`, control })
  const pointsPlatformId = useWatch({ name: "pointsId", control })

  const isConversionDisabled = numOfPointsPlatforms
    ? pointsPlatformId === null
    : false
  const isSubmitDisabled = isConversionDisabled || !conversion

  const chain = useWatch({
    control,
    name: `pool.chain`,
  })

  const baseCurrency = useWatch({
    name: "pool.data.baseCurrency",
    control,
  })

  const token0 = useWatch({ name: `pool.data.token0`, control })
  const token1 = useWatch({ name: `pool.data.token1`, control })

  const { symbol0, symbol1 } = useSymbolsOfPair(Chains[chain], token0, token1)

  return (
    <Stack gap={4}>
      <Text colorScheme="gray">
        Configure the reward users will earn for providing liquidity
      </Text>

      <FormControl>
        <Stack gap={0}>
          <HStack gap={0} mb={2}>
            <FormLabel mb={0}>Base currency</FormLabel>
            <Tooltip
              label="The reward will be calculated based on the amount of liquidity provided in the currency you select"
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
            onChange={(newValue: "token0" | "token1") =>
              setValue("pool.data.baseCurrency", newValue)
            }
            chakraStyles={{ size: "sm" }}
          />
        </Stack>
      </FormControl>

      <SelectPointType />

      <Box
        {...(isConversionDisabled ? { opacity: 0.5, pointerEvents: "none" } : {})}
      >
        <LiquidityConversion />
      </Box>

      <Button
        colorScheme={"green"}
        onClick={onSubmit}
        ml="auto"
        mt={5}
        isDisabled={isSubmitDisabled}
        isLoading={isLoading}
      >
        Create Liquidity Incentive role
      </Button>
    </Stack>
  )
}

export default SetLiquidityPointsRewardStep
