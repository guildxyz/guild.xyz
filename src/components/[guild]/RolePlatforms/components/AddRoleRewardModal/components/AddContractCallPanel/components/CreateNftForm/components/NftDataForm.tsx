import { Link } from "@chakra-ui/next-js"
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Skeleton,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import StartEndTimeForm from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityModal/components/StartEndTimeForm"
import useGuildFee from "components/[guild]/collect/hooks/useGuildFee"
import Button from "components/common/Button"
import CheckboxColorCard from "components/common/CheckboxColorCard"
import FormErrorMessage from "components/common/FormErrorMessage"
import useTriggerNetworkChange from "hooks/useTriggerNetworkChange"
import { useRouter } from "next/router"
import { ArrowSquareOut, Clock, Hash, Plus, TrashSimple } from "phosphor-react"
import {
  useController,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import {
  CONTRACT_CALL_SUPPORTED_CHAINS,
  ContractCallSupportedChain,
} from "../hooks/useCreateNft"
import ImagePicker from "./ImagePicker"
import MintPerAddressInput from "./MintPerAddressInput"
import NftTypeInput from "./NftTypeInput"
import SupplyInput from "./SupplyInput"

export type CreateNftFormType = {
  chain: ContractCallSupportedChain
  tokenTreasury: `0x${string}`
  name: string
  price: number
  description?: string
  image: string
  attributes: { name: string; value: string }[]
  maxSupply: number
  mintableAmountPerUser: number

  // Chakra's radio can only handle strings unfortunately
  soulbound: "true" | "false"

  // RolePlatform related
  startTime?: string
  endTime?: string
}

type Props = {
  isEditMode?: boolean
  submitButton: JSX.Element
}

const NftDataForm = ({ isEditMode, submitButton }: Props) => {
  const { chainId, address } = useAccount()
  const { requestNetworkChange, isNetworkChangeInProgress } =
    useTriggerNetworkChange()

  const {
    control,
    register,
    setValue,
    formState: { errors, defaultValues },
  } = useFormContext<CreateNftFormType>()

  const chain = useWatch({
    control,
    name: "chain",
  })
  const shouldSwitchChain = Chains[chainId] !== chain

  const {
    field: {
      ref: priceFieldRef,
      value: priceFieldValue,
      onChange: priceFieldOnChange,
      onBlur: priceFieldOnBlur,
    },
  } = useController({
    control,
    name: "price",
    defaultValue: 0,
    rules: {
      min: {
        value: 0,
        message: "Amount must be positive",
      },
    },
  })

  const { guildFee } = useGuildFee(chain)
  const formattedGuildFee =
    guildFee && chain
      ? Number(formatUnits(guildFee, CHAIN_CONFIG[chain].nativeCurrency.decimals))
      : undefined

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  })

  const metadataBgColor = useColorModeValue("white", "blackAlpha.300")

  const { pathname } = useRouter()

  return (
    <Stack spacing={8}>
      <Grid w="full" templateColumns="repeat(5, 1fr)" gap={8}>
        <GridItem colSpan={{ base: 5, sm: 2 }}>
          <Box position={{ base: "relative", sm: "sticky" }} top={0}>
            <ImagePicker />
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 5, sm: 3 }}>
          <Stack spacing={6}>
            <FormControl isInvalid={!!errors?.name}>
              <FormLabel>Name</FormLabel>

              <Input
                {...register("name", { required: "This field is required" })}
                isDisabled={isEditMode}
              />

              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors?.description}>
              <FormLabel>Metadata description</FormLabel>

              <Textarea {...register("description")} />

              <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>

              <FormHelperText>
                This text-only description will be part of the NFT metadata
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Metadata values</FormLabel>

              <Stack spacing={2}>
                {fields?.map((field, index) => (
                  <Box
                    key={field.id}
                    p={2}
                    bgColor={metadataBgColor}
                    borderRadius="xl"
                    borderWidth={"1px"}
                  >
                    <Grid templateColumns="1fr 0.5rem 1fr 2.5rem" gap={1}>
                      <FormControl isInvalid={!!errors?.attributes?.[index]?.name}>
                        <Input
                          placeholder="Name"
                          variant={"filled"}
                          {...register(`attributes.${index}.name`, {
                            required: "This field is required",
                          })}
                        />
                        <FormErrorMessage>
                          {errors?.attributes?.[index]?.name?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <Flex justifyContent="center">
                        <Text as="span" mt={2}>
                          :
                        </Text>
                      </Flex>

                      <FormControl isInvalid={!!errors?.attributes?.[index]?.value}>
                        <Input
                          placeholder="Value"
                          variant={"filled"}
                          {...register(`attributes.${index}.value`, {
                            required: "This field is required",
                          })}
                        />
                        <FormErrorMessage>
                          {errors?.attributes?.[index]?.value?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <Flex justifyContent="end">
                        <IconButton
                          aria-label="Remove attribute"
                          icon={<TrashSimple />}
                          colorScheme="red"
                          size="sm"
                          rounded="full"
                          variant="ghost"
                          onClick={() => remove(index)}
                          mt={1}
                        />
                      </Flex>
                    </Grid>
                  </Box>
                ))}

                <Button
                  leftIcon={<Plus />}
                  onClick={() =>
                    append({
                      name: "",
                      value: "",
                    })
                  }
                >
                  Add attribute
                </Button>
              </Stack>
            </FormControl>

            <Divider />

            <NftTypeInput />

            <Stack spacing={2}>
              <CheckboxColorCard
                colorScheme="indigo"
                variant="outline"
                icon={Hash}
                title="Limit supply"
                description="Limit the total number of NFTs and the number each user can collect. First come, first served."
                defaultChecked={
                  defaultValues.maxSupply > 0 ||
                  defaultValues.mintableAmountPerUser > 0
                }
                onChange={(e) => {
                  if (e.target.checked) return
                  setValue("maxSupply", 0, { shouldDirty: true })
                  setValue("mintableAmountPerUser", 0, { shouldDirty: true })
                }}
              >
                <Stack spacing={4} w="calc(100% - 2px)">
                  <SupplyInput />
                  <MintPerAddressInput />
                </Stack>
              </CheckboxColorCard>

              <Tooltip
                label="You'll be able to limit claiming time after you added the NFT reward to a role"
                shouldWrapChildren
                hasArrow
                isDisabled={pathname !== "/create-guild"}
              >
                <CheckboxColorCard
                  isDisabled={pathname === "/create-guild"}
                  colorScheme="indigo"
                  variant="outline"
                  icon={Clock}
                  title="Limit claiming time"
                  description="Set a claim period for the NFT."
                  defaultChecked={
                    !!defaultValues.startTime || !!defaultValues.endTime
                  }
                  onChange={(e) => {
                    if (e.target.checked) return
                    setValue("startTime", "", { shouldDirty: true })
                    setValue("endTime", "", { shouldDirty: true })
                  }}
                >
                  <StartEndTimeForm
                    platformType="CONTRACT_CALL"
                    control={control}
                    startTimeField="startTime"
                    endTimeField="endTime"
                    direction="column"
                  />
                </CheckboxColorCard>
              </Tooltip>
            </Stack>

            <Divider />

            <ChainPicker
              controlName="chain"
              supportedChains={CONTRACT_CALL_SUPPORTED_CHAINS}
              showDivider={false}
              isDisabled={isEditMode}
            />

            <FormControl isInvalid={!!errors?.price}>
              <FormLabel>Price</FormLabel>

              <InputGroup w="full">
                <NumberInput
                  w="full"
                  ref={priceFieldRef}
                  value={priceFieldValue}
                  onChange={(newValue) => {
                    if (/^[0-9]*\.0*$/i.test(newValue))
                      return priceFieldOnChange(newValue)

                    const valueAsNumber = parseFloat(newValue)

                    priceFieldOnChange(!isNaN(valueAsNumber) ? newValue : "")
                  }}
                  onBlur={priceFieldOnBlur}
                  min={0}
                  sx={{
                    "> input": {
                      borderRightRadius: 0,
                    },
                    "div div:first-of-type": {
                      borderTopRightRadius: 0,
                    },
                    "div div:last-of-type": {
                      borderBottomRightRadius: 0,
                    },
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                {chain && (
                  <InputRightAddon>
                    {CHAIN_CONFIG[chain].nativeCurrency.symbol}
                  </InputRightAddon>
                )}
              </InputGroup>

              <FormHelperText>
                {"Collectors will pay an additional "}
                <Skeleton display="inline" h={3} isLoaded={!!formattedGuildFee}>
                  {formattedGuildFee ?? "..."}
                </Skeleton>
                {` ${
                  chain ? CHAIN_CONFIG[chain].nativeCurrency.symbol : "COIN"
                } Guild minting fee. `}
                <Link
                  href="https://help.guild.xyz/en/articles/8193498-guild-base-fee"
                  isExternal
                  textDecoration="underline"
                >
                  Learn more
                  <Icon as={ArrowSquareOut} ml={0.5} />
                </Link>
              </FormHelperText>

              <FormErrorMessage>{errors?.price?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors?.tokenTreasury}>
              <FormLabel>Payout address</FormLabel>

              <Input
                {...register("tokenTreasury", {
                  required: "This field is required.",
                  pattern: {
                    value: ADDRESS_REGEX,
                    message:
                      "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                  },
                })}
                placeholder={`e.g. ${address}`}
              />

              <FormHelperText>
                When users pay for minting the NFT, you'll receive the funds on this
                wallet address
              </FormHelperText>

              <FormErrorMessage>{errors?.tokenTreasury?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
        </GridItem>
      </Grid>

      <HStack justifyContent="end">
        {shouldSwitchChain && (
          <Button
            data-test="create-nft-switch-network-button"
            isLoading={isNetworkChangeInProgress}
            loadingText="Check your wallet"
            onClick={() => requestNetworkChange(Chains[chain])}
          >{`Switch to ${CHAIN_CONFIG[chain].name}`}</Button>
        )}

        <Tooltip
          label={
            !!address
              ? "Please switch to a supported chain"
              : "Please connect an EVM wallet"
          }
          isDisabled={!!address && !shouldSwitchChain}
          hasArrow
        >
          {submitButton}
        </Tooltip>
      </HStack>
    </Stack>
  )
}
export default NftDataForm
