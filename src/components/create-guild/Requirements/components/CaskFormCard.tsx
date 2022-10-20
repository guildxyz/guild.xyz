import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement } from "types"

type Props = {
  index: number
  field: Requirement
}

const CaskFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl>
        <FormLabel>ID:</FormLabel>

        <Controller
          name={`requirements.${index}.data.id` as const}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder="Optional"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Provider:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.1`}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value?.value ?? ""}
              placeholder="Optional"
              onChange={(newChange) => {
                onChange({ trait_type: "provider", value: newChange.target.value })
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Plan ID:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.0`}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value?.value ?? ""}
              placeholder="Optional"
              onChange={(newChange) => {
                onChange({ trait_type: "planId", value: newChange.target.value })
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default CaskFormCard
