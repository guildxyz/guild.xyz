import {
  Box,
  FormControl,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { GuildFormType, Requirement } from "types"

type Props = {
  index: number
  field: Requirement
}

const MinMaxAmount = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const [showMax, setShowMax] = useState(!isNaN(field.data?.maxAmount))

  const toggleShowMax = () => setShowMax(!showMax)

  useEffect(() => {
    if (showMax) return
    setValue(`requirements.${index}.data.maxAmount`, undefined)
    clearErrors(`requirements.${index}.data.maxAmount`)
  }, [showMax])

  return (
    <VStack alignItems="start" position="relative" w="full">
      <Box>
        <Text fontWeight="semibold">Minimum amount:</Text>
        <Text
          tabIndex={0}
          position="absolute"
          top={1}
          right={0}
          colorScheme="gray"
          fontSize="sm"
          cursor="pointer"
          onClick={toggleShowMax}
        >
          {showMax ? "remove max amount" : "+ set max amount"}
        </Text>
      </Box>

      <HStack w="full" spacing={2} alignItems="start">
        <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.minAmount}>
          <Controller
            name={`requirements.${index}.data.minAmount` as const}
            control={control}
            defaultValue={field.data?.minAmount}
            rules={{
              required: "This field is required.",
              min: {
                value: 0,
                message: "Amount must be positive",
              },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <NumberInput
                ref={ref}
                value={value}
                defaultValue={field.data?.minAmount}
                onChange={(newValue) => {
                  const parsedValue = parseInt(newValue)
                  onChange(isNaN(parsedValue) ? "" : parsedValue)
                }}
                onBlur={onBlur}
                min={0}
              >
                <NumberInputField placeholder="Min" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />

          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.minAmount?.message}
          </FormErrorMessage>
        </FormControl>

        {showMax && (
          <>
            <Text as="span" h={10} lineHeight={10}>
              -
            </Text>

            <FormControl
              isInvalid={!!errors?.requirements?.[index]?.data?.maxAmount}
            >
              <Controller
                name={`requirements.${index}.data.maxAmount` as const}
                control={control}
                defaultValue={field.data?.maxAmount}
                rules={{
                  required: "This field is required.",
                  min: {
                    value: 0,
                    message: "Amount must be positive",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumberInput
                    ref={ref}
                    value={value}
                    defaultValue={field.data?.maxAmount}
                    onChange={(newValue) => {
                      const parsedValue = parseInt(newValue)
                      onChange(isNaN(parsedValue) ? "" : parsedValue)
                    }}
                    onBlur={onBlur}
                    min={0}
                  >
                    <NumberInputField placeholder="Max" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />

              <FormErrorMessage>
                {errors?.requirements?.[index]?.data?.maxAmount?.message}
              </FormErrorMessage>
            </FormControl>
          </>
        )}
      </HStack>
    </VStack>
  )
}

export default MinMaxAmount
