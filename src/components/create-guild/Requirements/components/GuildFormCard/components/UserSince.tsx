import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const UserSince = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.creationDate}
    >
      <FormLabel>Date</FormLabel>

      <Controller
        control={control}
        name={`${baseFieldPath}.data.creationDate`}
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
              const valueAsTimestamp = new Date(e.target.value)
              onChange(valueAsTimestamp)
            }}
            value={value ? new Date(value).toISOString().split("T")[0] : ""}
            min={new Date("2022-07-11").toISOString().split("T")[0]}
            max={new Date().toISOString().split("T")[0]}
          />
        )}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.creationDate?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default UserSince
