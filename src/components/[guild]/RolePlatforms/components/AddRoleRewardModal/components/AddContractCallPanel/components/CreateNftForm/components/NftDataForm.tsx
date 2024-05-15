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
import FormErrorMessage from "components/common/FormErrorMessage"
import useTriggerNetworkChange from "hooks/useTriggerNetworkChange"
import { ArrowSquareOut, Plus, TrashSimple } from "phosphor-react"
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
import RichTextDescriptionEditor from "./RichTextDescriptionEditor"
import SupplyInput from "./SupplyInput"

export type CreateNftFormType = {
  chain: ContractCallSupportedChain
  tokenTreasury: `0x${string}`
  name: string
  price: number
  description?: string
  richTextDescription?: string
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
    formState: { errors },
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
    defaultValue: 0, // TODO:
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

  const {
    field: { onChange: onDescriptionChange, value: richTextDescription },
  } = useController({ control, name: "richTextDescription" })

  const metadataBgColor = useColorModeValue("white", "blackAlpha.300")

  return (
    <Stack spacing={8}>
      <Grid w="full" templateColumns="repeat(5, 1fr)" gap={8}>
        <GridItem colSpan={{ base: 5, sm: 2 }}>
          <ImagePicker />
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

            <FormControl isInvalid={!!errors?.richTextDescription}>
              <FormLabel>Claiming page description</FormLabel>

              <RichTextDescriptionEditor
                onChange={onDescriptionChange}
                defaultValue={richTextDescription}
              />

              <FormErrorMessage>
                {errors?.richTextDescription?.message}
              </FormErrorMessage>

              <FormHelperText>
                This rich text description is only displayed on the claim page. It
                can contain images, links, and formatted text
              </FormHelperText>
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
            <SupplyInput />
            <MintPerAddressInput />
            <StartEndTimeForm
              platformType="CONTRACT_CALL"
              control={control}
              startTimeField="startTime"
              endTimeField="endTime"
            />

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
