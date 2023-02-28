import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chain, Chains } from "connectors"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import { useRef } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import TokenPicker from "requirements/common/TokenPicker"
import { MonetizePoapForm } from "types"
import useFeeInUSD from "./hooks/useFeeInUSD"
import useIsGnosisSafe from "./hooks/useIsGnosisSafe"
import useMonetizePoap from "./hooks/useMonetizePoap"
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

const POAP_DROP_SUPPORTED_CHAINS: Chain[] = [
  "ETHEREUM",
  "POLYGON",
  "BSC",
  "GNOSIS",
  "GOERLI",
]

const handlePriceChange = (newValue, onChange) => {
  if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
  const parsedValue = parseFloat(newValue)
  return onChange(isNaN(parsedValue) ? "" : parsedValue)
}

const PoapPaymentForm = ({ onClose }): JSX.Element => {
  const { account, chainId } = useWeb3React()
  const { requestNetworkChange, isNetworkChangeInProgress } =
    useWeb3ConnectionManager()

  const { poapData } = useCreatePoapContext()
  const feeCollectorContract = useFeeCollectorContract()

  const defaultValues = {
    chain: Chains[chainId] as Chain,
    token: "0x0000000000000000000000000000000000000000",
    owner: account,
    fee: undefined,
  }

  const methods = useForm<MonetizePoapForm>({
    mode: "all",
    defaultValues,
  })

  const {
    control,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = methods

  const token = useWatch({ control, name: "token" })
  const fee = useWatch({ control, name: "fee" })
  const coingeckoId =
    token === "0x0000000000000000000000000000000000000000"
      ? coingeckoCoinIds[chainId]
      : undefined
  const { feeInUSD } = useFeeInUSD(fee, coingeckoId)

  const pastedAddress = useWatch({ control, name: "owner" })
  const { isGnosisSafe } = useIsGnosisSafe(pastedAddress)
  const { usersGnosisSafes, isUsersGnosisSafesLoading } = useUsersGnosisSafes()

  const gnosisSafeLogoUrl = useColorModeValue(
    "/img/gnosis-safe-green.svg",
    "/img/gnosis-safe-white.svg"
  )

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()
  const alertCancelRef = useRef()

  const onModalClose = () => {
    if (isLoading) {
      onAlertOpen()
      return
    }
    reset(defaultValues)
    onClose()
  }

  const { onSubmit: onMonetizeSubmit, isLoading: isMonetizeLoading } =
    useMonetizePoap(onModalClose)
  const { onSubmit, isLoading } = useRegisterVault((vaultId) =>
    onMonetizeSubmit({
      poapId: poapData?.id,
      vaultId,
      chainId,
      contract: feeCollectorContract?.address,
    })
  )

  const chain: Chain = useWatch({ control, name: "chain" })
  const isOnCorrectChain = chainId === Chains[chain]

  return (
    <FormProvider {...methods}>
      <Stack spacing="4">
        <ChainPicker
          controlName={`chain` as const}
          supportedChains={POAP_DROP_SUPPORTED_CHAINS}
          onChange={() => setValue("token", null)}
        />
        <TokenPicker fieldName="token" chain={chain} />
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
              <InputGroup>
                <NumberInput
                  ref={ref}
                  value={value ?? undefined}
                  onChange={(newValue) => handlePriceChange(newValue, onChange)}
                  onBlur={onBlur}
                  min={0}
                  w="full"
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
            )}
          />
          <FormErrorMessage>{errors?.fee?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors?.owner}>
          <FormLabel>Address to receive payments to</FormLabel>
          <InputGroup>
            {/* {isGnosisSafe && (
              <InputLeftElement>
                <Img src={gnosisSafeLogoUrl} alt="Gnosis Safe" boxSize={5} />
              </InputLeftElement>
            )} */}
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
        {/* {!usersGnosisSafes?.length && isUsersGnosisSafesLoading && (
          <HStack pt={8}>
            <Spinner size="sm" />
            <Text as="span">Checking your Gnosis Safes</Text>
          </HStack>
        )}
        <Collapse in={usersGnosisSafes?.length > 0}>
          <Stack pt={8}>
            <Text mb={4} color="gray">
              We've detected that you are an owner of one or more Gnosis Safes.
              Consider using a safe for more secure payments.
            </Text>
            {usersGnosisSafes?.map((safe) => (
              <HStack key={safe}>
                <Img src={gnosisSafeLogoUrl} alt="Gnosis Safe" boxSize={4} />
                <Tooltip label={safe}>
                  <Text as="span" color="gray" fontWeight="bold" fontSize="sm">
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
                  isDisabled={safe.toLowerCase() === pastedAddress?.toLowerCase()}
                  onClick={() => setValue("owner", safe, { shouldValidate: true })}
                >
                  Use this safe
                </Button>
              </HStack>
            ))}
          </Stack>
        </Collapse> */}
        <Text colorScheme="gray" fontSize="sm">
          You need to register a vault in Guild's Payment contract in order to
          receive payments. You'll be able to collect funds from it anytime.
        </Text>
      </Stack>
      <HStack justifyContent={"right"} mt="8">
        {isOnCorrectChain ? (
          <Button
            colorScheme={"green"}
            onClick={handleSubmit(onSubmit)}
            isDisabled={!isOnCorrectChain || !token || !fee}
            isLoading={isLoading || isMonetizeLoading}
            loadingText={isMonetizeLoading ? "Monetizing POAP" : "Registering vault"}
          >
            Register vault & add requirement
          </Button>
        ) : (
          <Button
            colorScheme="blue"
            onClick={() => requestNetworkChange(Chains[chain])}
            isLoading={isNetworkChangeInProgress}
            loadingText="Check your wallet"
          >
            Switch network
          </Button>
        )}
      </HStack>
      <Alert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        leastDestructiveRef={alertCancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Please wait</AlertDialogHeader>
          <AlertDialogBody>
            You can't close the modal until the transaction is completed.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={alertCancelRef} onClick={onAlertClose}>
              Okay
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Alert>
      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default PoapPaymentForm
