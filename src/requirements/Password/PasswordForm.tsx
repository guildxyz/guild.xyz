import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const PasswordForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.password}
      >
        <FormLabel>Password</FormLabel>
        <Controller
          name={`${baseFieldPath}.data.password`}
          control={control}
          // TODO: rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="password"
              autoComplete="off" // TODO: doesn't work
              ref={ref}
              maxLength={32}
              value={value ?? ""}
              placeholder="Required password"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.password?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default PasswordForm
