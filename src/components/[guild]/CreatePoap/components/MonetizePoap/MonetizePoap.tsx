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
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import NetworkButtonsList from "components/common/Layout/components/Account/components/NetworkModal/components/NetworkButtonsList"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { Chains, RPC } from "connectors"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import { Check, CoinVertical } from "phosphor-react"
import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { MonetizePoapForm } from "types"
import shortenHex from "utils/shortenHex"
import { useCreatePoapContext } from "../CreatePoapContext"
import TokenPicker from "./components/TokenPicker"
import useFeeInUSD from "./hooks/useFeeInUSD"
import useIsGnosisSafe from "./hooks/useIsGnosisSafe"
import useRegisterVault from "./hooks/useRegisterVault"
import useUsersGnosisSafes from "./hooks/useUsersGnosisSafes"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const coingeckoCoinIds = {
  1: "ethereum",
  137: "matic-network",
  100: "xdai",
  56: "binancecoin",
  5: "ethereum",
}

const handlePriceChange = (newValue, onChange) => {
  if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
  const parsedValue = parseFloat(newValue)
  return onChange(isNaN(parsedValue) ? "" : parsedValue)
}

const MonetizePoap = (): JSX.Element => {
  const { nextStep, poapDropSupportedChains } = useCreatePoapContext()
  const feeCollectorContract = useFeeCollectorContract()

  const { account, chainId } = useWeb3React()

  const { colorMode } = useColorMode()

  const methods = useForm<MonetizePoapForm>({
    mode: "all",
    defaultValues: {
      token: "0x0000000000000000000000000000000000000000",
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

  const [isChainPickerOpen, setIsChainPickerOpen] = useState(false)
  useEffect(() => {
    if (!chainId) return
    setIsChainPickerOpen(false)
  }, [chainId])

  const token = useWatch({ control, name: "token" })
  const fee = useWatch({ control, name: "fee" })
  const coingeckoId =
    token === "0x0000000000000000000000000000000000000000"
      ? coingeckoCoinIds[chainId]
      : undefined
  const { feeInUSD, isFeeInUSDLoading } = useFeeInUSD(fee, coingeckoId)

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
            maxW="lg"
          >
            <GridItem colSpan={2}>
              <FormControl textAlign="left" mb={4}>
                <FormLabel>Pick a chain</FormLabel>
                <HStack
                  w="max-content"
                  px={2}
                  py={1}
                  h={10}
                  bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
                  borderRadius="lg"
                  borderWidth={1}
                  spacing={3}
                >
                  <HStack spacing={2}>
                    <Img
                      boxSize={4}
                      src={RPC[Chains[chainId]]?.iconUrls?.[0]}
                      alt={RPC[Chains[chainId]]?.chainName}
                    />
                    <Text as="span" fontWeight="bold">
                      {RPC[Chains[chainId]]?.chainName}
                    </Text>
                  </HStack>

                  <Button
                    size="xs"
                    borderRadius="md"
                    onClick={() => setIsChainPickerOpen(true)}
                  >
                    Switch
                  </Button>
                </HStack>
              </FormControl>

              <Collapse in={isChainPickerOpen}>
                <NetworkButtonsList listedChainIDs={poapDropSupportedChains} small />
              </Collapse>
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 1 }}>
              <TokenPicker />
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
                <Collapse in={feeInUSD > 0}>
                  <FormHelperText>
                    {isFeeInUSDLoading || !feeInUSD
                      ? "Loading..."
                      : `$${feeInUSD.toFixed(2)}`}
                  </FormHelperText>
                </Collapse>
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
          <NetworkButtonsList listedChainIDs={poapDropSupportedChains} />
        </VStack>
      )}

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default MonetizePoap
