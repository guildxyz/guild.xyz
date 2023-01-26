import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Chain } from "connectors"
import { useController, useFormContext, useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import TokenPicker from "requirements/common/TokenPicker"
import { PAYMENT_SUPPORTED_CHAINS } from "requirements/Payment/PaymentForm"

export type RegisterVaultFormType = {
  chain: Chain
  token: string
  fee: number
  owner: string
}

type Props = {
  isDisabled?: boolean
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

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

  return (
    <Stack spacing={4}>
      <ChainPicker
        controlName="chain"
        supportedChains={PAYMENT_SUPPORTED_CHAINS}
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
            // TODO: fetch price in USD
            // sx={
            //   feeInUSD > 0 && {
            //     "> input": {
            //       borderRightRadius: 0,
            //     },
            //     "div div:first-of-type": {
            //       borderTopRightRadius: 0,
            //     },
            //     "div div:last-of-type": {
            //       borderBottomRightRadius: 0,
            //     },
            //   }
            // }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          {/* {feeInUSD > 0 && (
                            <InputRightAddon fontSize="sm">
                              {`$${feeInUSD.toFixed(2)}`}
                            </InputRightAddon>
                          )} */}
        </InputGroup>

        <FormErrorMessage>{feeFieldError?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.owner}>
        <FormLabel>Address to pay to</FormLabel>
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
    </Stack>
  )
}

export default RegisterVaultForm
