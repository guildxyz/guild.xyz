import {
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { useFormContext, useWatch } from "react-hook-form"
import ControlledNumberInput from "requirements/WalletActivity/components/ControlledNumberInput"
import Token from "static/icons/token.svg"
import { MIN_TOKEN_AMOUNT } from "utils/guildCheckout/constants"
import { AddTokenFormType } from "../types"

const StaticAmount = () => {
  const { control } = useFormContext<AddTokenFormType>()
  const chain = useWatch({ name: `chain`, control })
  const address = useWatch({ name: `tokenAddress`, control })
  const imageUrl = useWatch({ name: `imageUrl`, control })

  const {
    data: { logoURI: tokenLogo },
  } = useTokenData(chain, address)

  return (
    <>
      <Text colorScheme="gray">Each user can claim the same amount of tokens.</Text>

      <Stack gap={0}>
        <FormLabel>Amount to reward</FormLabel>
        <InputGroup>
          <InputLeftElement>
            {tokenLogo || imageUrl ? (
              <OptionImage img={tokenLogo ?? imageUrl} alt={chain} />
            ) : (
              <Token />
            )}
          </InputLeftElement>

          <ControlledNumberInput min={MIN_TOKEN_AMOUNT} name="staticValue" />
        </InputGroup>
      </Stack>
    </>
  )
}

export default StaticAmount
