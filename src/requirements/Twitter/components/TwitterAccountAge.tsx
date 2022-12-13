import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const TwitterAccountAge = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `${baseFieldPath}.data.minAmount`,
    shouldUnregister: true,
  })

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
    >
      <FormLabel>Registered before</FormLabel>

      <Input
        type="date"
        ref={field.ref}
        name={field.name}
        value={
          field.value && !isNaN(field.value)
            ? new Date(field.value).toISOString().split("T")[0]
            : ""
        }
        onChange={(e) => {
          const valueAsTimestamp = new Date(e.target.value).getTime()
          field.onChange(valueAsTimestamp)
        }}
        onBlur={field.onBlur}
        max={new Date().toISOString().split("T")[0]}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TwitterAccountAge
