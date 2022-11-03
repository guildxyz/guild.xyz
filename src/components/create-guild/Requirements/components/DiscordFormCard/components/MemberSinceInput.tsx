import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext, useFormState } from "react-hook-form"

type Props = {
  index: number
  label: string
}

const MemberSinceInput = ({ index, label }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!errors?.requirements?.[index]?.data?.memberSince}
    >
      <FormLabel>{label}</FormLabel>

      <Controller
        control={control}
        name={`requirements.${index}.data.memberSince`}
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
              const valueAsTimestamp = new Date(e.target.value).getTime()
              onChange(valueAsTimestamp)
            }}
            value={value ? new Date(value).toISOString().split("T")[0] : ""}
            max={new Date().toISOString().split("T")[0]}
          />
        )}
      />

      <FormErrorMessage>
        {errors?.requirements?.[index]?.data?.memberSince?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default MemberSinceInput
