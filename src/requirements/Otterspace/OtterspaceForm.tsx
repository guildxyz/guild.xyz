import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

const OtterspaceForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    resetField,
    formState: { errors },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const badgeId = useWatch({ name: `${baseFieldPath}.data.id` })

  const { data } = useOtterspaceBadges(chain)

  const pickedBadge = data?.find((option) => option.value === badgeId)

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={["OPTIMISM", "GOERLI"]}
        onChange={() => resetField(`${baseFieldPath}.data.id`)}
      />

      <FormControl isRequired>
        <FormLabel>Badge:</FormLabel>

        <InputGroup>
          {pickedBadge && (
            <InputLeftElement>
              <OptionImage
                img={pickedBadge?.img as string}
                alt={pickedBadge?.label}
              />
            </InputLeftElement>
          )}

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
                onChange={(newSelectedOption: SelectOption) =>
                  onChange(newSelectedOption?.value ?? null)
                }
                onBlur={onBlur}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default OtterspaceForm
