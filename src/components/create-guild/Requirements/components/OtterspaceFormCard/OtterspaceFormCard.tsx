import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../ChainPicker"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

const OtterspaceFormCard = ({ baseFieldPath }: FormCardProps) => {
  const {
    control,
    resetField,
    formState: { errors },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  const { data } = useOtterspaceBadges(chain)

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={["OPTIMISM", "GOERLI"]}
        onChange={() => resetField(`${baseFieldPath}.data.id`)}
      />

      <FormControl isRequired>
        <FormLabel>Badge:</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.id` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={data}
              value={data?.find((option) => option.value === value) ?? ""}
              placeholder="Choose badge"
              onChange={(newSelectedOption: SelectOption) => {
                onChange(newSelectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default OtterspaceFormCard
