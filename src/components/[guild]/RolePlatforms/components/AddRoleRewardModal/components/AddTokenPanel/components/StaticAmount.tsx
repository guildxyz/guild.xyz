import {
  FormLabel,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { useFormContext, useWatch } from "react-hook-form"

const StaticAmount = () => {
  const { guildPlatforms } = useGuild()

  const { control } = useFormContext()
  const chain = useWatch({ name: `chain`, control })
  const address = useWatch({ name: `contractAddress`, control })

  const {
    data: { logoURI: tokenLogo },
  } = useTokenData(chain, address)

  return (
    <>
      <Text colorScheme="gray" mt={-2}>
        Each user can claim the same amount of tokens.
      </Text>

      <Stack gap={0}>
        <FormLabel>Amount to reward</FormLabel>
        <InputGroup>
          <InputLeftElement>
            <OptionImage img={tokenLogo} alt={chain} />
          </InputLeftElement>

          <NumberInput w="full" min={0.0001} step={0.0001} value={1}>
            <NumberInputField pl="10" pr={0} />
            <NumberInputStepper padding={"0 !important"}>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>
      </Stack>
    </>
  )
}

export default StaticAmount
