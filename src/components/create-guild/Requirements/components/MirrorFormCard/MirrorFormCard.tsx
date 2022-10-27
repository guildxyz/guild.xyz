import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement } from "types"
import ChainInfo from "../ChainInfo"
import useMirrorEdition from "./hooks/useMirrorEdition"

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

  useEffect(() => {
    if (!register) return
    register(`requirements.${index}.chain`, {
      value: "OPTIMISM",
    })
  }, [register])

  const address = useWatch({ name: `requirements.${index}.address` })

  const { isLoading, image, name } = useMirrorEdition(address)

  return (
    <>
      <ChainInfo>Works on Optimism</ChainInfo>

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.address}>
        <FormLabel>Address:</FormLabel>
        <InputGroup>
          {(isLoading || image) && (
            <InputLeftElement>
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <OptionImage img={image} alt={name} />
              )}
            </InputLeftElement>
          )}
          <Input
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

        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default MirrorFormCard
