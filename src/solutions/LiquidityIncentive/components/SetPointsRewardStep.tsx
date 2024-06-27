import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,
  Tooltip
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Question } from "phosphor-react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { UniswapChains } from "requirements/Uniswap/hooks/useParsePoolTokenId"
import { useSymbolsOfPair } from "requirements/Uniswap/hooks/useSymbolsOfPair"
import ControlledNumberInput from "requirements/WalletActivity/components/ControlledNumberInput"
import { Chains } from "wagmiConfig/chains"
import LiquidityConversion from "./LiquidityConversion"
import SelectPointType from "./SelectPointType"

const SetPointsReward = ({ onSubmit }: { onSubmit: () => Promise<void> }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const conversion = useWatch({ name: `conversion` })
  const pointsPlatformId = useWatch({ name: "pointsId" })

  const isConversionDisabled = pointsPlatformId === undefined
  const isSubmitDisabled = isConversionDisabled || !conversion

  const [isLoading, setIsLoading] = useState(false)

  const chain: UniswapChains = useWatch({
    name: `pool.chain`,
  })

  const token0 = useWatch({ name: `pool.data.token0` })
  const token1 = useWatch({ name: `pool.data.token1` })

  const { symbol0, symbol1 } = useSymbolsOfPair(Chains[chain], token0, token1)

  return (
    <Stack gap={5}>
      <Text colorScheme="gray">
        Configure the reward users will earn for providing liquidity.
      </Text>

      <FormControl isInvalid={!!errors?.amount}>
        <HStack mb={2} spacing={0}>
          <FormLabel mb={0}>Minimum liquidity required</FormLabel>
          <Tooltip
            label="Users must provide at least this amount of liquidity to the pool to earn the reward"
            placement="top"
            hasArrow
          >
            <Icon as={Question} color="GrayText" />
          </Tooltip>
        </HStack>
        <InputGroup w={"full"}>

          <InputLeftAddon>
            <Text as="span" fontSize="xs" fontWeight="bold" noOfLines={1}>
              {`${symbol0}/${symbol1} `}
            </Text>
          </InputLeftAddon>

          <ControlledNumberInput
            numberFormat="FLOAT"
            name={"pool.data.minAmount"}
            adaptiveStepSize
            numberInputFieldProps={{ pr: 7, pl: 4, borderStartRadius: 0 }}
            min={0}
            w="full"
          />

        </InputGroup>
        <FormErrorMessage>{errors?.amount?.message as string}</FormErrorMessage>
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
