import {
  Box,
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
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import Link from "components/common/Link"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { Chain, Chains, RPC } from "connectors"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { ArrowSquareOut, Plus, TrashSimple } from "phosphor-react"
import {
  FormProvider,
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import ImagePicker from "./components/ImagePicker"

type Props = { onSuccess: (deployedContractAddress: string) => void }

export type CreateNftFormType = {
  chain: Chain
  owner: string
  name: string
  symbol: string
  price: number
  description: string
  imageUrl: string
  attributes: { name: string; value: string }[]
}

const CONTRACT_CALL_SUPPORTED_CHAINS: Chain[] = ["POLYGON", "POLYGON_MUMBAI"]

const CreateNftForm = ({ onSuccess }: Props) => {
  const { chainId, account } = useWeb3React()
  const userIsOnUnsupportedChain = !CONTRACT_CALL_SUPPORTED_CHAINS.includes(
    Chains[chainId] as Chain
  )

  const methods = useForm<CreateNftFormType>({
    mode: "all",
  })
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods

  const chain = useWatch({
    control,
    name: "chain",
  })

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  })

  // TODO: maybe we could simply use the pinFileToIPFS function inside onSubmit, that feels like a much cleaner solution for me...
  const fileUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
    onError: () => {
      setValue("imageUrl", "", {
        shouldTouch: true,
      })
    },
  })

  const onSubmit = (data) => {
    console.log("CreateNftForm:onSubmit:", data)
    /**
     * TODO
     *
     * - Generate metadata (get name, description, attributes, and imageUrl from the
     *   form)
     * - Upload metadata
     * - Contract call (useCreateNft)
     * - Confetti
     */
  }

  const { handleSubmit: handleCreateNftSubmit } = useSubmitWithUpload(
    handleSubmit(onSubmit),
    fileUploader.isUploading
  )

  return (
    <FormProvider {...methods}>
      <Stack spacing={8}>
        <Text>
          Create an NFT that users will be able to mint through your guild page or
          its own mint page, if they satisfy the requirements you'll set to it.
        </Text>

        <Grid w="full" templateColumns="repeat(3, 1fr)" gap={8}>
          <GridItem colSpan={{ base: 3, sm: 1 }}>
            <ImagePicker />
          </GridItem>

          <GridItem colSpan={{ base: 3, sm: 2 }}>
            <Stack spacing={6}>
              <ChainPicker
                controlName="chain"
                supportedChains={["POLYGON", "POLYGON_MUMBAI"]}
                showDivider={false}
              />

              <HStack spacing={4} alignItems="start">
                <FormControl isInvalid={!!errors?.name}>
                  <FormLabel>Name</FormLabel>

                  <Input
                    {...register("name", { required: "This field is required" })}
                  />

                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors?.symbol} maxW={48}>
                  <FormLabel>Symbol</FormLabel>

                  <Input
                    {...register("symbol", { required: "This field is required" })}
                  />

                  <FormErrorMessage>{errors?.symbol?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

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

                  <InputRightAddon>
                    {RPC[chain]?.nativeCurrency?.symbol}
                  </InputRightAddon>
                </InputGroup>

                <FormHelperText>
                  {`Collectors will pay an additional 0.1 ${RPC[chain]?.nativeCurrency?.symbol} Guild minting fee. `}
                  <Link href="#" isExternal textDecoration="underline">
                    Learn more
                    <Icon as={ArrowSquareOut} ml={0.5} />
                  </Link>
                </FormHelperText>

                <FormErrorMessage>{errors?.price?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Supply</FormLabel>

                <Tooltip label="Coming soon" placement="top" hasArrow>
                  <NumberInput isDisabled>
                    <NumberInputField placeholder="Unlimited" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Tooltip>
              </FormControl>

              <FormControl isInvalid={!!errors?.description}>
                <FormLabel>NFT description</FormLabel>

                <Textarea
                  {...register("description", {
                    required: "This field is required",
                  })}
                />

                <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>

                <FormHelperText>
                  This description will be shown on the collect NFT page. You can use
                  markdown syntax here.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Metadata</FormLabel>

                <Stack spacing={2}>
                  {fields?.map((field, index) => (
                    <Box
                      key={field.id}
                      p={2}
                      bgColor="blackAlpha.300"
                      borderRadius="xl"
                    >
                      <Grid templateColumns="1fr 0.5rem 1fr 2.5rem" gap={1}>
                        <FormControl isInvalid={!!errors?.attributes?.[index]?.name}>
                          <Input
                            placeholder="Name"
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

                        <FormControl
                          isInvalid={!!errors?.attributes?.[index]?.value}
                        >
                          <Input
                            placeholder="Value"
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
                    leftIcon={<Icon as={Plus} />}
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

              <FormControl isInvalid={!!errors?.owner}>
                <FormLabel>Payout address</FormLabel>

                <Input
                  {...register("owner", {
                    required: "This field is required.",
                    pattern: {
                      value: ADDRESS_REGEX,
                      message:
                        "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                    },
                  })}
                  placeholder={`e.g. ${account}`}
                />

                <FormErrorMessage>{errors?.owner?.message}</FormErrorMessage>
              </FormControl>
            </Stack>
          </GridItem>
        </Grid>

        <Flex justifyContent="end">
          <Tooltip
            label="Please switch to a supported chain"
            isDisabled={!userIsOnUnsupportedChain}
          >
            <Button
              colorScheme="indigo"
              isDisabled={userIsOnUnsupportedChain}
              onClick={handleCreateNftSubmit}
            >
              Create NFT
            </Button>
          </Tooltip>
        </Flex>
      </Stack>

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default CreateNftForm
