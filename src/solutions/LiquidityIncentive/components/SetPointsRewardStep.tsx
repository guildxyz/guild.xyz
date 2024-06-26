import {
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
import { Question } from "phosphor-react"
import { Controller, useFormContext } from "react-hook-form"

const SetPointsReward = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

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
          name={`amount` as const}
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
    </Stack>
  )
}

export default SetPointsReward
