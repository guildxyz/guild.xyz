import {
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import { Check, CoinVertical } from "phosphor-react"
import { useContext, useEffect } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import shortenHex from "utils/shortenHex"
import { useCreatePoapContext } from "../CreatePoapContext"
import useIsGnosisSafe from "./hooks/useIsGnosisSafe"
import useRegisterVault from "./hooks/useRegisterVault"
import useUsersGnosisSafes from "./hooks/useUsersGnosisSafes"

type TokenOption = {
  label: "ETH" | "USDC" | "DAI" | "OWO"
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
  //   value: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // mainnet address
  //   img: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
  // },
  // {
  //   label: "DAI",
  //   value: "0x6b175474e89094c44da98b954eedeac495271d0f", // mainnet address
  //   img: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
  // },
  // {
  //   label: "OWO",
  //   value: "0x3C65D35A8190294d39013287B246117eBf6615Bd",
  //   img: "https://goerli.etherscan.io/images/main/empty-token.png",
  // },
]

type MonetizePoapForm = {
  token: string
  fee: number
  owner: string
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const handlePriceChange = (newValue, onChange) => {
  if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
  const parsedValue = parseFloat(newValue)
  return onChange(isNaN(parsedValue) ? "" : parsedValue)
}

const MonetizePoap = (): JSX.Element => {
  const { nextStep, poapDropSupportedChains } = useCreatePoapContext()

  const { account, chainId } = useWeb3React()
  const { setListedChainIDs, openNetworkModal } = useContext(Web3Connection)

  const feeCollectorContract = useFeeCollectorContract()

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
    setValue,
    formState: { errors },
    handleSubmit,
  } = methods

  const token = useWatch({ control, name: "token" })
  const pickedToken = TOKENS.find((t) => t.value === token) || TOKENS[0]

  const pastedAddress = useWatch({ control, name: "owner" })
  const { isGnosisSafe, isGnosisSafeLoading } = useIsGnosisSafe(pastedAddress)
  const { usersGnosisSafes } = useUsersGnosisSafes()

  const gnosisSafeLogoUrl = useColorModeValue(
    "/img/gnosis-safe-green.svg",
    "/img/gnosis-safe-white.svg"
  )

  const { onSubmit, isLoading, response } = useRegisterVault()

  useEffect(() => {
    if (!response) return
    nextStep()
  }, [response])

  const handleSwitchChain = () => {
    setListedChainIDs(poapDropSupportedChains)
    openNetworkModal()
  }

  return (
    <FormProvider {...methods}>
      {poapDropSupportedChains.includes(chainId) ? (
        <VStack spacing={0} alignItems="start">
          <Grid
            mb={12}
            templateColumns="repeat(2, 1fr)"
            columnGap={4}
            rowGap={6}
            w="full"
            maxW="md"
          >
            <GridItem colSpan={2}>
              <FormControl textAlign="left">
                <FormLabel>Pick a chain</FormLabel>
                <Button
                  leftIcon={
                    <Img
                      src={RPC[Chains[chainId]]?.iconUrls?.[0]}
                      alt={RPC[Chains[chainId]]?.chainName}
                      boxSize={4}
                    />
                  }
                  onClick={handleSwitchChain}
                >
                  {RPC[Chains[chainId]]?.chainName}
                </Button>
                <FormHelperText>
                  POAP monetoization is available on Ethereum, BSC, and Görli.
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 1 }}>
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

            <GridItem colSpan={{ base: 2, md: 1 }}>
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
                      <NumberInputField />
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

            <GridItem colSpan={2}>
              <Stack textAlign="left">
                <FormControl isRequired isInvalid={!!errors?.owner}>
                  <FormLabel>Address to pay to</FormLabel>
                  <InputGroup>
                    {(isGnosisSafeLoading || isGnosisSafe) && (
                      <InputLeftElement>
                        {isGnosisSafeLoading && <Spinner size="sm" />}
                        {isGnosisSafe && (
                          <Img
                            src={gnosisSafeLogoUrl}
                            alt="Gnosis Safe"
                            boxSize={5}
                          />
                        )}
                      </InputLeftElement>
                    )}
                    <Input
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

                <Collapse in={usersGnosisSafes?.length > 0}>
                  <Stack pt={8}>
                    <Text mb={4} color="gray">
                      We've detected that you are an owner of one or more Gnosis
                      Safes. Consider using a safe for more secure payments.
                    </Text>

                    {usersGnosisSafes?.map((safe) => (
                      <HStack key={safe}>
                        <Img src={gnosisSafeLogoUrl} alt="Gnosis Safe" boxSize={4} />

                        <Tooltip label={safe}>
                          <Text
                            as="span"
                            color="gray"
                            fontWeight="bold"
                            fontSize="sm"
                          >
                            {shortenHex(safe, 5)}
                          </Text>
                        </Tooltip>

                        <Button
                          size="xs"
                          borderRadius="lg"
                          leftIcon={
                            safe.toLowerCase() === pastedAddress?.toLowerCase() && (
                              <Icon
                                as={Check}
                                bgColor="green.400"
                                rounded="full"
                                boxSize={4}
                                p={1}
                                color="white"
                              />
                            )
                          }
                          isDisabled={
                            safe.toLowerCase() === pastedAddress?.toLowerCase()
                          }
                          onClick={() =>
                            setValue("owner", safe, { shouldValidate: true })
                          }
                        >
                          Use this safe
                        </Button>
                      </HStack>
                    ))}
                  </Stack>
                </Collapse>
              </Stack>
            </GridItem>
          </Grid>

          <HStack w="full" justifyContent="end" spacing={2}>
            <Button onClick={nextStep}>Skip</Button>

            {feeCollectorContract ? (
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
            ) : (
              // This shouldn't happen, but handled this case too until we test this feature
              <Tooltip label="Switch to a supported chain" shouldWrapChildren>
                <Button
                  colorScheme="indigo"
                  isDisabled
                  leftIcon={<Icon as={CoinVertical} />}
                >
                  Monetize POAP
                </Button>
              </Tooltip>
            )}
          </HStack>
        </VStack>
      ) : (
        <VStack
          spacing={4}
          pb={{ base: 6, sm: 0 }}
          alignItems={{ base: "start", sm: "center" }}
        >
          <Text>Please switch to a supported chain!</Text>
          <Button size="sm" onClick={handleSwitchChain}>
            Switch chain
          </Button>
        </VStack>
      )}

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default MonetizePoap
