import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  Spinner,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement } from "types"
import ChainInfo from "../ChainInfo"
import useMirrorEdition from "../MirrorV2FormCard/hooks/useMirrorEdition"

type Props = {
  index: number
  field: Requirement
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const MirrorFormCard = ({ index }: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const address = useWatch({ name: `requirements.${index}.address` })

  const { isLoading, name } = useMirrorEdition(address, "ETHEREUM")

  return (
    <>
      <ChainInfo>Works on Ethereum</ChainInfo>

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.address}>
        <FormLabel>Address:</FormLabel>
        <InputGroup>
          <Input
            isDisabled
            {...register(`requirements.${index}.address`, {
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
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default MirrorFormCard
