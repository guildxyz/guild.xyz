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
import useToken from "hooks/useToken"
import { useController, useFormContext, useWatch } from "react-hook-form"
import useFeeInUSD from "requirements/Payment/components/RegisterVaultForm/hooks/useFeeInUSD"
import ChainPicker from "requirements/common/ChainPicker"
import TokenPicker from "requirements/common/TokenPicker"
import {
  ADDRESS_REGEX,
  NULL_ADDRESS,
  paymentSupportedChains,
} from "utils/guildCheckout/constants"
import { useChainId } from "wagmi"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"

const coingeckoCoinIds: Partial<Record<Chain, string>> = {
  ETHEREUM: "ethereum",
  POLYGON: "matic-network",
  GOERLI: "ethereum",
}

export type RegisterVaultFormType = {
  chain: Chain
  token: `0x${string}`
  fee: string
  owner: `0x${string}`
}

type Props = {
  isDisabled?: boolean
}

const RegisterVaultForm = ({ isDisabled }: Props): JSX.Element => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterVaultFormType>()
  const chain = useWatch({ control, name: "chain" })
  const token = useWatch({ control, name: "token" })

  const { data: tokenData } = useToken({
    address: token,
    chainId: Chains[chain],
    shouldFetch: Boolean(token !== NULL_ADDRESS && chain),
  })
  const chainId = useChainId()

  const validateFee = (value: string): boolean | string => {
    const tokenDecimals =
      token === NULL_ADDRESS
        ? CHAIN_CONFIG[Chains[chainId] as Chain].nativeCurrency.decimals
        : tokenData?.decimals
    const lastDotIndex = value.lastIndexOf(".")
    const decimalPrecision = value.slice(lastDotIndex + 1).length
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    if (decimalPrecision > tokenDecimals) {
      return `Decimal places must not exceed ${tokenDecimals} digits.`
    }

    return true
  }

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
      validate: validateFee,
    },
  })

  const handleFeeChange = (valueAsString: string) => {
    const legalChars = "0123456789."
    const filteredInput = [...valueAsString]
      .filter((char) => legalChars.includes(char))
      .join("")

    feeFieldOnChange(filteredInput)
  }

  const { feeInUSD } = useFeeInUSD(
    feeFieldValue,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    token === NULL_ADDRESS ? coingeckoCoinIds[chain] : undefined
  )

  return (
    <Stack spacing={4}>
      <ChainPicker
        controlName="chain"
        supportedChains={paymentSupportedChains}
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        onChange={() => setValue("token", null)}
        isDisabled={isDisabled}
      />

      <TokenPicker chain={chain} fieldName="token" isDisabled={isDisabled} />

      <FormControl isRequired isInvalid={!!feeFieldError}>
        <FormLabel>Price</FormLabel>

        <InputGroup>
          <NumberInput
            isDisabled={isDisabled || !tokenData || !token || !chain}
            w="full"
            ref={feeFieldRef}
            value={feeFieldValue ?? undefined}
            min={0}
            clampValueOnBlur={false}
            onChange={(valueAsString) => handleFeeChange(valueAsString)}
            onBlur={feeFieldOnBlur}
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
        <FormErrorMessage>{errors?.owner?.message}</FormErrorMessage>
      </FormControl>
      <Text colorScheme="gray" fontSize="sm">
        You need to register a vault in Guild's Payment contract in order to receive
        payments. You'll be able to collect funds from it anytime.
      </Text>
    </Stack>
  )
}

export default RegisterVaultForm
