import {
  AspectRatio,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { Chain, Chains } from "connectors"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { Image, Plus, TrashSimple } from "phosphor-react"
import { useFieldArray, useForm } from "react-hook-form"
import ChainButton from "./components/ChainButton"

/**
 * - Step state: "DEPLOY_CONTRACT" or "SETUP_ROLE" (or something like that)
 * - If step === "DEPLOY_CONTRACT", show this simple form
 * - On success, save the contract address (the new CONTRACT_CALL reward) to our DB
 * - On success, setStep to "SETUP_ROLE"
 * - If step === "SETUP_ROLE", show the 2 tabs (create role or select an existing role)
 */

const CONTRACT_CALL_SUPPORTED_CHAINS: Chain[] = ["POLYGON", "POLYGON_MUMBAI"]

type Props = {
  onSuccess: () => void
}

type CreateNftForm = {
  name: string
  symbol: string
  description: string
  imageUrl: string
  attributes: { name: string; value: string }[]
}

const AddContractCallPanel = ({ onSuccess }: Props) => {
  const { chainId } = useWeb3React()
  const userIsOnUnsupportedChain = !CONTRACT_CALL_SUPPORTED_CHAINS.includes(
    Chains[chainId] as Chain
  )

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNftForm>({
    mode: "all",
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  })

  // TODO: upload metadata too!
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

  const onSubmit = () => {
    // TODO
    onSuccess()
  }

  const {} = useSubmitWithUpload(handleSubmit(onSubmit), fileUploader.isUploading)

  return (
    <>
      <Stack spacing={8}>
        <Text>
          Create an NFT that users will be able to mint through your guild page or
          its own mint page, if they satisfy the requirements you'll set to it.
        </Text>

        <FormControl>
          <FormLabel>Chain</FormLabel>
          <Wrap>
            {CONTRACT_CALL_SUPPORTED_CHAINS.map((chain) => (
              <ChainButton key={chain} chain={chain} />
            ))}
            {userIsOnUnsupportedChain && (
              <ChainButton chain={Chains[chainId] as Chain} unsupported />
            )}
          </Wrap>
        </FormControl>

        <Grid w="full" templateColumns="repeat(3, 1fr)" gap={8}>
          <GridItem colSpan={{ base: 3, sm: 1 }}>
            <FormControl isInvalid={!!errors?.imageUrl}>
              <FormLabel>Media</FormLabel>

              <AspectRatio ratio={1}>
                <Button borderWidth={1} variant="ghost">
                  <VStack>
                    <Icon as={Image} weight="light" boxSize={16} color="gray" />
                    <Text
                      display={{ base: "none", md: "inline" }}
                      colorScheme="gray"
                      fontSize="sm"
                      fontWeight="normal"
                    >
                      Choose or drop file here
                    </Text>
                  </VStack>
                </Button>
              </AspectRatio>

              <FormErrorMessage>{errors?.imageUrl?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 3, sm: 2 }}>
            <Stack spacing={4}>
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

              <FormControl isInvalid={!!errors?.description}>
                <FormLabel>Description</FormLabel>

                <Textarea
                  {...register("description", {
                    required: "This field is required",
                  })}
                />

                <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
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
            </Stack>
          </GridItem>
        </Grid>

        <Flex justifyContent="end">
          <Tooltip
            label="Please switch to a supported chain"
            isDisabled={!userIsOnUnsupportedChain}
          >
            <Button colorScheme="indigo" isDisabled>
              Create NFT
            </Button>
          </Tooltip>
        </Flex>
      </Stack>

      <DynamicDevTool control={control} />
    </>
  )
}

export default AddContractCallPanel
