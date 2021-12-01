import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
} from "@chakra-ui/react"
import { Select } from "components/common/ChakraReactSelect"
import { useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField } from "temporaryData/types"
import FormCard from "../FormCard"
import Symbol from "../Symbol"
import useJuicebox from "./hooks/useJuicebox"

type Props = {
  index: number
  field: RequirementFormField
  onRemove: () => void
}

const JuiceboxFormCard = ({ index, field, onRemove }: Props): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const value = useWatch({ name: `requirements.${index}.value` })

  const { projects, isLoading } = useJuicebox()
  const mappedOptions = useMemo(
    () =>
      projects?.map((project) => ({
        img: project.logoUri,
        label: project.name,
        value: project.id,
      })),
    [projects]
  )

  const pickedProject = useMemo(
    () => mappedOptions?.find((project) => project.value === value),
    [value, mappedOptions]
  )

  return (
    <FormCard type={field.type} onRemove={onRemove}>
      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.value}>
        <FormLabel>Project:</FormLabel>

        <InputGroup>
          {value && (
            <Symbol
              symbol={pickedProject?.img}
              isInvalid={errors?.requirements?.[index]?.value}
            />
          )}
          <Controller
            name={`requirements.${index}.value` as const}
            control={control}
            defaultValue={field.value}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <Select
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedOptions}
                placeholder="Search..."
                value={mappedOptions?.find((option) => option.value === selectValue)}
                defaultValue={mappedOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(selectedOption) => onChange(selectedOption?.value)}
                onBlur={onBlur}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.value?.message}
        </FormErrorMessage>
      </FormControl>
    </FormCard>
  )
}

export default JuiceboxFormCard
