import {
  FormControl,
  FormControlProps,
  FormLabel,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useColorModeValue,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  format?: "INT" | "FLOAT" | "PERCENTAGE"
  baseFieldPath: string
  label: string
  fieldName: string
  min?: number
  max?: number
  step?: number
} & FormControlProps

const NumberField = ({
  format = "INT",
  baseFieldPath,
  label,
  fieldName,
  min,
  max,
  step,
  ...rest
}: Props) => {
  const addonBg = useColorModeValue("gray.100", "gray.700")
  const addonBorder = useColorModeValue("gray.200", "gray.600")

  const {
    control,
    formState: { errors },
  } = useFormContext()

  const handleChange = (newValue, onChange) => {
    if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
    let parsedValue =
      format === "INT" || format === "PERCENTAGE"
        ? parseInt(newValue)
        : parseFloat(newValue)

    if (!isNaN(parsedValue) && format === "PERCENTAGE") parsedValue /= 100

    return onChange(isNaN(parsedValue) ? "" : parsedValue)
  }

  return (
    <FormControl
      {...rest}
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.[fieldName]}
    >
      <FormLabel>{label}</FormLabel>

      <InputGroup w="full">
        <Controller
          name={`${baseFieldPath}.data.${fieldName}` as const}
          control={control}
          rules={{
            required: rest.isRequired ? "This field is required." : undefined,
            min: min
              ? {
                  value: min,
                  message: `Must be greater than or equal to ${
                    format === "PERCENTAGE" ? min * 100 : min
                  }`,
                }
              : undefined,
            max: max
              ? {
                  value: max,
                  message: `Must be less than or equal to ${
                    format === "PERCENTAGE" ? max * 100 : max
                  }`,
                }
              : undefined,
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              w="full"
              ref={ref}
              value={
                !isNaN(value) && format === "PERCENTAGE"
                  ? (value * 100).toFixed(0)
                  : value ?? ""
              }
              onChange={(newValue) => handleChange(newValue, onChange)}
              onBlur={onBlur}
              min={format === "PERCENTAGE" && min ? min * 100 : undefined}
              max={format === "PERCENTAGE" && max ? max * 100 : undefined}
              step={step}
              sx={
                format === "PERCENTAGE" && {
                  "> input": {
                    borderRightRadius: 0,
                  },
                  "div div:first-of-type": {
                    borderTopRightRadius: 0,
                  },
                  "div div:last-of-type": {
                    borderBottomRightRadius: 0,
                  },
                }
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        {format === "PERCENTAGE" && (
          <InputRightAddon bgColor={addonBg} borderColor={addonBorder}>
            %
          </InputRightAddon>
        )}
      </InputGroup>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.[fieldName]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default NumberField
