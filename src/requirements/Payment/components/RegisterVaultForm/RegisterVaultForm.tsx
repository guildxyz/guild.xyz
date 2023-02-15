import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useFeeInUSD from "components/[guild]/CreatePoap/components/Requirements/components/MonetizePoap/hooks/useFeeInUSD"
import { Chain } from "connectors"
import { useController, useFormContext, useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import TokenPicker from "requirements/common/TokenPicker"
import {
  ADDRESS_REGEX,
  NULL_ADDRESS,
  paymentSupportedChains,
} from "utils/guildCheckout/constants"

const coingeckoCoinIds: Partial<Record<Chain, string>> = {
  // TODO: add these for the supported chains
  // 1: "ethereum",
  // 137: "matic-network",
  // 100: "xdai",
  // 56: "binancecoin",
  GOERLI: "ethereum",
}

export type RegisterVaultFormType = {
  chain: Chain
  token: string
  fee: number
  owner: string
}

type Props = {
  isDisabled?: boolean
}

const RegisterVaultForm = ({ isDisabled }: Props): JSX.Element => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterVaultFormType>()
  const chain = useWatch({ name: "chain" })

  const {
    field: {
      ref: feeFieldRef,
      value: feeFieldValue,
      onChange: feeFieldOnChange,
      onBlur: feeFieldOnBlur,
    },
    fieldState: { error: feeFieldError },
  } = useController({
    name: "fee",
    rules: {
      required: "This field is required.",
      min: {
        value: 0,
        message: "Amount must be positive",
      },
    },
  })

  const handleFeeChange = (newValue, onChange) => {
    if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
    const parsedValue = parseFloat(newValue)
    return onChange(isNaN(parsedValue) ? "" : parsedValue)
  }

  const token = useWatch({ name: "token" })

  const { feeInUSD } = useFeeInUSD(
    feeFieldValue,
    token === NULL_ADDRESS ? coingeckoCoinIds[chain] : undefined
  )

  return (
    <Stack spacing={4}>
      <ChainPicker
        controlName="chain"
        supportedChains={paymentSupportedChains}
        onChange={() => setValue("token", null)}
        isDisabled={isDisabled}
      />

      <TokenPicker chain={chain} fieldName="token" isDisabled={isDisabled} />

      <FormControl isRequired isInvalid={!!feeFieldError}>
        <FormLabel>Price</FormLabel>

        <InputGroup>
          <NumberInput
            isDisabled={isDisabled}
            w="full"
            ref={feeFieldRef}
            value={feeFieldValue ?? undefined}
            onChange={(newValue) => handleFeeChange(newValue, feeFieldOnChange)}
            onBlur={feeFieldOnBlur}
            min={0}
            sx={
              feeInUSD > 0 && {
                "> input": {
                  borderRightRadius: 0,
                },
                "div div:first-of-type": {
                  borderTopRightRadius: 0,
                },
                "div div:last-of-type": {
                  borderBottomRightRadius: 0,
                },
              }
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          {feeInUSD > 0 && (
            <InputRightAddon fontSize="sm">
              {`$${feeInUSD.toFixed(2)}`}
            </InputRightAddon>
          )}
        </InputGroup>

        <FormHelperText>Creators keep 90% of their revenue</FormHelperText>

        <FormErrorMessage>{feeFieldError?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.owner}>
        <FormLabel>Address to receive payments to</FormLabel>
        <InputGroup>
          {/* {isGnosisSafe && (
                <InputLeftElement>
                  <Img
                    src={gnosisSafeLogoUrl}
                    alt="Gnosis Safe"
                    boxSize={5}
                  />
                </InputLeftElement>
              )} */}

          <Input
            isDisabled={isDisabled}
            {...register("owner", {
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
            })}
          />
        </InputGroup>
        <FormErrorMessage>{errors?.owner?.message}</FormErrorMessage>
      </FormControl>
      <Text colorScheme="gray" fontSize="sm">
        You need to register a vault in Guild's Payment contract in order to receive
        payments. You'll be able to withdraw from it any time.
      </Text>
    </Stack>
  )
}

export default RegisterVaultForm
