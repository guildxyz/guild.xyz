import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { FormCardProps } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../ChainInfo"
import useMirrorEdition from "./hooks/useMirrorEdition"

const SIMPLE_ADDRESS_REGEX = /0x[A-F0-9]{40}/i
const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const MirrorV2FormCard = ({ baseFieldPath }: FormCardProps): JSX.Element => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`${baseFieldPath}.chain`, {
      value: "OPTIMISM",
    })
  }, [register])

  const {
    ref: addressInputRef,
    name: addressInputName,
    onBlur: onAddressInputBlur,
    onChange: onAddressInputChange,
  } = register(`${baseFieldPath}.address`, {
    required: "This field is required",
    pattern: {
      value: ADDRESS_REGEX,
      message: "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
    },
  })

  const address = useWatch({ name: `${baseFieldPath}.address` })

  const { isLoading, image, name } = useMirrorEdition(address)

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on Optimism</ChainInfo>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Address:</FormLabel>
        <InputGroup>
          {image && (
            <InputLeftElement>
              <OptionImage img={image} alt={name} />
            </InputLeftElement>
          )}
          <Input
            ref={addressInputRef}
            name={addressInputName}
            onBlur={onAddressInputBlur}
            onChange={(e) => {
              const newValue = e.target.value

              if (!newValue?.startsWith("https://qx.app/collection")) {
                onAddressInputChange(e)
                return
              }

              const matchedValue = newValue.match(SIMPLE_ADDRESS_REGEX)?.[0]
              if (matchedValue) setValue(`${baseFieldPath}.address`, matchedValue)
            }}
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

export default MirrorV2FormCard
