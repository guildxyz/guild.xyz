import {
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
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
import Button from "components/common/Button"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { useState } from "react"
import { useWatch } from "react-hook-form"

const PoolStep = ({ onContinue }: { onContinue: () => void }) => {
  const chain = useWatch({ name: `chain` })
  const address = useWatch({ name: `contractAddress` })

  const [skip, setSkip] = useState(false)

  const {
    data: { logoURI: tokenLogo },
  } = useTokenData(chain, address)

  return (
    <Stack gap={5}>
      <Text colorScheme="gray">
        Supply the tokens users will receive their eligible amount from. You'll be
        able to deposit more and withdraw from any time.
      </Text>

      <Stack gap={1}>
        <FormControl>
          <FormLabel>Amount to deposit</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <OptionImage img={tokenLogo} alt={chain} />
            </InputLeftElement>

            <NumberInput
              w="full"
              min={0.0001}
              step={0.0001}
              value={0}
              isDisabled={skip}
            >
              <NumberInputField pl="10" pr={0} />
              <NumberInputStepper padding={"0 !important"}>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
        </FormControl>

        <HStack w="full" justifyContent={"left"} spacing={3}>
          <Text fontWeight="semibold" colorScheme="gray">
            or
          </Text>
          <Checkbox
            spacing={1.5}
            isChecked={skip}
            onChange={() => setSkip(!skip)}
          ></Checkbox>
          <Text
            fontWeight="medium"
            colorScheme="gray"
            _hover={{ cursor: "pointer" }}
            onClick={() => setSkip(!skip)}
          >
            deposit tokens later
          </Text>
        </HStack>
      </Stack>

      <Flex justifyContent={"flex-end"} mt="4">
        <Button isDisabled={false} colorScheme="primary" onClick={onContinue}>
          Continue
        </Button>
      </Flex>
    </Stack>
  )
}

export default PoolStep
