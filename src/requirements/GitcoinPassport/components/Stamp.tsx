import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const Stamp = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.stamp}>
      <FormLabel>Stamp</FormLabel>

      <Input
        {...register(`${baseFieldPath}.data.stamp`, {
          required: "This field is required",
        })}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.stamp?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Stamp
