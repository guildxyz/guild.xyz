import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"

const FollowerCount = ({ index }: { index: number }) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <>
      <FormControl
        isInvalid={!!errors?.requirements?.[index]?.data?.minAmount?.message}
      >
        <FormLabel>Minimum number of followers</FormLabel>
        <NumberInput>
          <NumberInputField
            {...register(`requirements.${index}.data.minAmount`, {
              required: "This field if required",
            })}
          />
        </NumberInput>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default FollowerCount
