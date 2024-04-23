import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const LensPostInput = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
    >
      <FormLabel>Post ID:</FormLabel>

      <Controller
        name={`${baseFieldPath}.data.id` as const}
        control={control}
        rules={{
          required: "This field is required.",
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            ref={ref}
            placeholder="Paste Hey link"
            value={value ?? ""}
            onChange={(event) => {
              const newValue = event.target.value
              const split = newValue.split("/")
              onChange(split[split.length - 1])
            }}
            onBlur={onBlur}
          />
        )}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export default LensPostInput
