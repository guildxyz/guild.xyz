import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const VisitLinkForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath).data?.link}>
      <FormLabel>Link user has to go to</FormLabel>
      <Input
        {...register(`${baseFieldPath}.data.link`, {
          required: "This field is required",
        })}
        placeholder="https://guild.xyz"
      />
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.link?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default VisitLinkForm
