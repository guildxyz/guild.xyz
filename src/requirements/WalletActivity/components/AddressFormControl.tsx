import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useTokenData from "hooks/useTokenData"
import { useFormContext, useWatch } from "react-hook-form"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import parseFromObject from "utils/parseFromObject"

type Props = {
  type?: "ASSET" | "ADDRESS"
  baseFieldPath: string
}

const AddressFormControl = ({
  type = "ADDRESS",
  baseFieldPath,
}: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })

  const {
    data: { symbol },
    isValidating,
  } = useTokenData(chain, address)

  return (
    <FormControl
      isRequired={type === "ASSET"}
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
    >
      <FormLabel>{`${
        type === "ADDRESS" ? "Wallet or smart contract" : "Asset"
      } address`}</FormLabel>
      <InputGroup>
        {address && (symbol || isValidating) && (
          <InputLeftAddon fontWeight="semibold">
            {isValidating ? <Spinner size="sm" /> : symbol}
          </InputLeftAddon>
        )}
        <Input
          {...register(`${baseFieldPath}.address`, {
            required: type === "ASSET" ? "This field is required" : false,
            pattern: {
              value: ADDRESS_REGEX,
              message: "Invalid address",
            },
          })}
        />
      </InputGroup>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.address?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default AddressFormControl
