import {
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { ArrowSquareOut } from "phosphor-react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

const typeOptions = [
  {
    value: "PARALLEL_ID",
    label: "Have a Parallel ID",
  },
  {
    value: "PARALLEL_SANCTIONS_SAFE",
    label: "Be sanctions safe",
  },
  {
    value: "PARALLEL_TRAIT",
    label: "Be accredited",
  },
]

const ParallelForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl isRequired>
        <FormLabel>Type:</FormLabel>

        <Controller
          name={`${baseFieldPath}.type` as const}
          control={control}
          rules={{
            required: "This field is required.",
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              options={typeOptions}
              placeholder="Choose type"
              value={typeOptions?.find((option) => option.value === value)}
              onChange={(newSelectedOption: SelectOption) =>
                onChange(newSelectedOption.value ?? null)
              }
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>

      {type === "PARALLEL_SANCTIONS_SAFE" && (
        <FormControl isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}>
          <FormLabel>Country ID:</FormLabel>

          <Controller
            name={`${baseFieldPath}.data.countryId` as const}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                type="number"
                ref={ref}
                placeholder="Optional"
                value={value ?? ""}
                onChange={(event) =>
                  onChange(event.target.value ? parseInt(event.target.value) : null)
                }
                onBlur={onBlur}
              />
            )}
          />
          <FormHelperText>
            <Link
              href="https://developer.parallelmarkets.com/docs/token/#sanctions-monitoring:~:text=The%20countryId%20parameter"
              isExternal
            >
              Docs
              <Icon as={ArrowSquareOut} ml="1" />
            </Link>
          </FormHelperText>

          <FormErrorMessage>
            {parseFromObject(errors, baseFieldPath)?.data?.countryId?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </Stack>
  )
}

export default ParallelForm
