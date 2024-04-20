import {
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { useController, useFormContext, useWatch } from "react-hook-form"
import Token from "static/icons/token.svg"
import { AddTokenFormType } from "../AddTokenPanel"
import ConversionNumberInput from "./ConversionNumberInput"

const StaticAmount = () => {
  const { control, setValue } = useFormContext<AddTokenFormType>()
  const chain = useWatch({ name: `chain`, control })
  const address = useWatch({ name: `tokenAddress`, control })
  const imageUrl = useWatch({ name: `imageUrl`, control })

  const {
    data: { logoURI: tokenLogo },
  } = useTokenData(chain, address)

  const {
    field: { value: staticValue },
  } = useController({
    name: "staticValue",
    defaultValue: 1,
  })

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

          <ConversionNumberInput
            value={`${staticValue}`}
            setValue={(val) => setValue("staticValue", Number(val))}
          />
        </InputGroup>
      </Stack>
    </>
  )
}

export default StaticAmount
