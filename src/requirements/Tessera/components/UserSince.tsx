import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const UserSince = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minDate}
    >
      <FormLabel>Date</FormLabel>

      <Controller
        control={control}
        name={`${baseFieldPath}.data.minDate`}
        defaultValue={null}
        rules={{
          required: "This field is required.",
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            type="date"
            ref={ref}
            onBlur={onBlur}
            onChange={(e) => {
              try {
                const valueAsDate = new Date(e.target.value).toISOString()
                onChange(valueAsDate)
              } catch (_) {}
            }}
            value={value ? value.split("T")[0] : ""}
            max={new Date().toISOString().split("T")[0]}
          />
        )}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.minDate?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default UserSince
