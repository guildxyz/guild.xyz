import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Chain } from "connectors"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i
const SUPPORTED_CHAINS: Chain[] = [
  "POLYGON",
  "AVALANCHE",
  "FANTOM",
  "MOONBEAM",
  "GNOSIS",
  "CELO",
  "ARBITRUM",
  "OPTIMISM",
]

const CaskForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        supportedChains={SUPPORTED_CHAINS}
        controlName={`${baseFieldPath}.chain`}
      />
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.data?.provider}
      >
        <FormLabel>Provider:</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.provider` as const}
          control={control}
          rules={{
            required: "This field is required.",
            pattern: {
              value: ADDRESS_REGEX,
              message:
                "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder="e.g.: 0x4aB5...123"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.provider?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.data?.planId}
      >
        <FormLabel>Plan ID:</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.planId` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="number"
              ref={ref}
              value={value ?? ""}
              placeholder="e.g.: 123456789"
              onChange={(event) => onChange(+event.target.value)}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.planId?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default CaskForm
