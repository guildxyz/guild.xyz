import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Question } from "phosphor-react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement } from "types"
import capitalize from "utils/capitalize"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  field: Requirement
  label?: string
  format?: "INT" | "FLOAT"
  hideSetMaxButton?: boolean
}

const MinMaxAmount = ({
  baseFieldPath,
  field,
  label = "amount",
  format = "INT",
  hideSetMaxButton = false,
}: Props): JSX.Element => {
  const {
    control,
    unregister,
    formState: { errors },
  } = useFormContext()

  const [showMax, setShowMax] = useState(!isNaN(field?.data?.maxAmount))

  const toggleShowMax = () =>
    setShowMax((prevValue) => {
      const newValue = !prevValue
      if (!newValue) unregister(`${baseFieldPath}.data.maxAmount`)
      return newValue
    })

  const handleChange = (newValue, onChange) => {
    if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
    const parsedValue = format === "INT" ? parseInt(newValue) : parseFloat(newValue)
    return onChange(isNaN(parsedValue) ? undefined : parsedValue)
  }

  return (
    <FormControl>
      <Flex justifyContent={"space-between"} w="full">
        <HStack mb={2} spacing={0}>
          <FormLabel mb={0}>
            {showMax ? `${capitalize(label)}:` : `Minimum ${label}:`}
          </FormLabel>

          {showMax && (
            <Tooltip
              label={`min <= ${label} to hold ${format === "INT" ? "<=" : "<"} max`}
            >
              <Question color="gray" />
            </Tooltip>
          )}
        </HStack>
        {!hideSetMaxButton && (
          <Button
            size="xs"
            variant="ghost"
            borderRadius={"lg"}
            onClick={toggleShowMax}
          >
            <Text colorScheme={"gray"}>
              {showMax ? `remove max ${label}` : `+ set max ${label}`}
            </Text>
          </Button>
        )}
      </Flex>

      <HStack w="full" spacing={2} alignItems="start">
        <FormControl
          isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
        >
          <Controller
            name={`${baseFieldPath}.data.minAmount` as const}
            control={control}
            rules={{
              min: {
                value: 0,
                message: `${capitalize(label)} must be positive`,
              },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <NumberInput
                ref={ref}
                value={value ?? ""}
                onChange={(newValue) => handleChange(newValue, onChange)}
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
            {parseFromObject(errors, baseFieldPath)?.data?.minAmount?.message}
          </FormErrorMessage>
        </FormControl>

        {showMax && (
          <>
            <Text as="span" h={10} lineHeight={10}>
              -
            </Text>

            <FormControl
              isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
            >
              <Controller
                name={`${baseFieldPath}.data.maxAmount` as const}
                control={control}
                rules={{
                  required: "This field is required.",
                  min: {
                    value: 0,
                    message: `${capitalize(label)} must be positive`,
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumberInput
                    ref={ref}
                    value={value ?? ""}
                    onChange={(newValue) => handleChange(newValue, onChange)}
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
                {parseFromObject(errors, baseFieldPath)?.data?.maxAmount?.message}
              </FormErrorMessage>
            </FormControl>
          </>
        )}
      </HStack>
    </FormControl>
  )
}

export default MinMaxAmount
