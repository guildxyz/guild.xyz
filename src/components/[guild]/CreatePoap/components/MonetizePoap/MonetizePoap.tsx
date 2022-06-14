import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { CoinVertical } from "phosphor-react"
import { useContext } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import useRegisterVault from "./hooks/useRegisterVault"

type TokenOption = {
  label: "ETH" | "USDC" | "DAI"
  value: string
  img: string
}

const TOKENS: TokenOption[] = [
  {
    label: "ETH",
    value: "0x0000000000000000000000000000000000000000",
    img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  },
  // {
  //   label: "USDC",
  //   value: "USDC",
  //   img: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
  // },
  // {
  //   label: "DAI",
  //   value: "DAI",
  //   img: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
  // },
]

// Görli for now
const SUPPORTED_CHAINS = [5]

type MonetizePoapForm = {
  token: string
  fee: number
  owner: string
}

type Props = {
  nextStep: () => void
}

const handlePriceChange = (newValue, onChange) => {
  if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
  const parsedValue = parseFloat(newValue)
  return onChange(isNaN(parsedValue) ? "" : parsedValue)
}

const MonetizePoap = ({ nextStep }: Props): JSX.Element => {
  const { account, chainId } = useWeb3React()
  const { openNetworkModal } = useContext(Web3Connection)

  const methods = useForm<MonetizePoapForm>({
    mode: "all",
    defaultValues: {
      token: TOKENS[0].value,
      owner: account,
    },
  })

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = methods

  const token = useWatch({ control, name: "token" })

  const pickedToken = TOKENS.find((t) => t.value === token) || TOKENS[0]

  const { onSubmit, isLoading } = useRegisterVault()

  return (
    <FormProvider {...methods}>
      {SUPPORTED_CHAINS.includes(chainId) ? (
        <VStack spacing={0}>
          <Grid
            mb={12}
            templateColumns="repeat(4, 1fr)"
            columnGap={4}
            rowGap={6}
            w="full"
          >
            <GridItem colSpan={{ base: 4, sm: 2, md: 1 }}>
              <FormControl isRequired>
                <FormLabel>Currency</FormLabel>
                <InputGroup>
                  {pickedToken && (
                    <InputLeftElement>
                      <OptionImage
                        img={pickedToken?.img ?? TOKENS[0]?.img}
                        alt={pickedToken?.label ?? TOKENS[0]?.label}
                      />
                    </InputLeftElement>
                  )}

                  <Controller
                    name="token"
                    control={control}
                    defaultValue="ETH"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <StyledSelect
                        ref={ref}
                        options={TOKENS}
                        value={TOKENS.find((t) => t.value === value)}
                        onChange={(selectedOption: TokenOption) =>
                          onChange(selectedOption.value)
                        }
                        onBlur={onBlur}
                      />
                    )}
                  />
                </InputGroup>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 4, sm: 2, md: 1 }}>
              <FormControl isRequired isInvalid={!!errors?.fee}>
                <FormLabel>Price</FormLabel>
                <Controller
                  name="fee"
                  control={control}
                  rules={{
                    required: "This field is required.",
                    min: {
                      value: 0,
                      message: "Amount must be positive",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <NumberInput
                      ref={ref}
                      value={value ?? undefined}
                      onChange={(newValue) => handlePriceChange(newValue, onChange)}
                      onBlur={onBlur}
                      min={0}
                    >
                      <NumberInputField placeholder="Min" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>{errors?.fee?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 4, md: 2 }}>
              <FormControl isRequired isInvalid={!!errors?.owner}>
                <FormLabel>Address to pay to</FormLabel>
                <Input
                  {...register("owner", { required: "This field is required." })}
                />
                <FormErrorMessage>{errors?.owner?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <HStack w="full" justifyContent="end" spacing={2}>
            <Button onClick={nextStep}>Skip</Button>

            <Button
              colorScheme="indigo"
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="Registering vault"
              onClick={handleSubmit(onSubmit, console.log)}
              leftIcon={<Icon as={CoinVertical} />}
            >
              Monetize POAP
            </Button>
          </HStack>
        </VStack>
      ) : (
        <VStack
          spacing={4}
          pb={{ base: 6, sm: 0 }}
          alignItems={{ base: "start", sm: "center" }}
        >
          <Text>Please switch to a supported chain!</Text>
          <Button size="sm" onClick={openNetworkModal}>
            Switch chain
          </Button>
        </VStack>
      )}

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default MonetizePoap
