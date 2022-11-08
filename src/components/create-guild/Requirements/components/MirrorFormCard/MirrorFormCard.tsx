import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  Spinner,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { FormCardProps } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../ChainInfo"
import useMirrorEdition from "../MirrorV2FormCard/hooks/useMirrorEdition"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const MirrorFormCard = ({ baseFieldPath }: FormCardProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const address = useWatch({ name: `${baseFieldPath}.address` })

  const { isLoading, name } = useMirrorEdition(address, "ETHEREUM")

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on Ethereum</ChainInfo>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Address:</FormLabel>
        <InputGroup>
          <Input
            isDisabled
            {...register(`${baseFieldPath}.address`, {
              required: "This field is required",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
            })}
          />
        </InputGroup>

        <FormHelperText>{isLoading ? <Spinner size="sm" /> : name}</FormHelperText>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default MirrorFormCard
