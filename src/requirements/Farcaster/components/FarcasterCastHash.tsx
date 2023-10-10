import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const FarcasterCastHash = ({ baseFieldPath }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.hash}
    >
      <FormLabel>Cast hash:</FormLabel>

      <Input
        {...register(`${baseFieldPath}.data.hash`, {
          required: "This field is required.",
          pattern: {
            value: ADDRESS_REGEX,
            message:
              "Please input a 42 characters long, 0x-prefixed hexadecimal hash.",
          },
        })}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.hash?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export default FarcasterCastHash
