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
import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import useSismoBadges, { SismoBadgeType } from "./hooks/useSismoBadges"

const typeOptions: { label: string; value: SismoBadgeType }[] = [
  {
    label: "Gnosis",
    value: "GNOSIS",
  },
  {
    label: "Polygon",
    value: "POLYGON",
  },
  {
    label: "Goerli",
    value: "GOERLI",
  },
  {
    label: "Mumbai",
    value: "MUMBAI",
  },
  {
    label: "Playground (deprecated)",
    value: "PLAYGROUND",
  },
]

const SismoForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`${baseFieldPath}.chain`, {
      value: "POLYGON",
    })
  }, [register])

  const type = useWatch({ name: `${baseFieldPath}.data.type` })
  const badgeId = useWatch({ name: `${baseFieldPath}.data.id` })
  const { data, isValidating } = useSismoBadges(type)

  const pickedBadge = data?.find((option) => option.value === badgeId)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.type}
      >
        <FormLabel>Network</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.type` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              options={typeOptions}
              value={typeOptions?.find((option) => option.value === value) ?? ""}
              placeholder="Select network"
              onChange={(newSelectedOption: SelectOption) => {
                setValue(`${baseFieldPath}.data.id`, null)
                onChange(newSelectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.type?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
        isDisabled={!type || isValidating}
      >
        <FormLabel>Badge</FormLabel>

        <InputGroup>
          {pickedBadge && (
            <InputLeftElement>
              <OptionImage img={pickedBadge?.img} alt={pickedBadge?.label} />
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
                onChange={(newSelectedOption: SelectOption) => {
                  onChange(newSelectedOption?.value)
                }}
                onBlur={onBlur}
                isLoading={isValidating}
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

export default SismoForm
