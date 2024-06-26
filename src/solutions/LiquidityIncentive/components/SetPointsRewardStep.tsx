import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Question } from "phosphor-react"
import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import LiquidityConversion from "./LiquidityConversion"
import SelectPointType from "./SelectPointType"

const SetPointsReward = ({ onSubmit }: { onSubmit: () => Promise<void> }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const conversion = useWatch({ name: `conversion` })
  const pointsPlatformId = useWatch({ name: "pointsId" })

  const setupName = useWatch({ name: "name" })

  const isConversionDisabled = pointsPlatformId === undefined && setupName === null
  const isSubmitDisabled = isConversionDisabled || !conversion

  const [isLoading, setIsLoading] = useState(false)

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
        <Controller
          name={`pool.data.minAmount` as const}
          control={control}
          rules={{
            min: {
              value: 0,
              message: "Amount must not be negative",
            },
          }}
          defaultValue={0}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              defaultValue={0}
              ref={ref}
              value={value ?? ""}
              onChange={(newValue) => {
                const parsedValue = parseInt(newValue)
                onChange(isNaN(parsedValue) ? 0 : parsedValue)
              }}
              onBlur={onBlur}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
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
