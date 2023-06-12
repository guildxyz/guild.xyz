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
import { ControlledCombobox } from "components/zag/Combobox"
import { ArrowSquareOut } from "phosphor-react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
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

const ParallelForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type}
      >
        <FormLabel>Type:</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.type`}
          rules={{
            required: "It's required to select a type",
          }}
          options={typeOptions}
          placeholder="Select type"
          disableOptionFiltering
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
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
