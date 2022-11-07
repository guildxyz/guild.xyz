import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  label: string
}

const MemberSinceInput = ({ baseFieldPath, label }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.memberSince}
    >
      <FormLabel>{label}</FormLabel>

      <Controller
        control={control}
        name={`${baseFieldPath}.data.memberSince`}
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
        {parseFromObject(errors, baseFieldPath).data?.memberSince?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default MemberSinceInput
