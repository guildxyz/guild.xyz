import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const FarcasterTextToInclude = ({ baseFieldPath }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
    >
      <FormLabel>Text to include:</FormLabel>

      <Input
        {...register(`${baseFieldPath}.data.id`, {
          required: "This field is required",
        })}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default FarcasterTextToInclude
