import {
  AspectRatio,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Icon,
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
import { Image } from "phosphor-react"
import { useForm } from "react-hook-form"
import ChainButton from "./components/ChainButton"

const CONTRACT_CALL_SUPPORTED_CHAINS: Chain[] = ["POLYGON", "POLYGON_MUMBAI"]

type Props = {
  onSuccess: () => void
}

const defaultValues = {}

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
  } = useForm<{ name: string; description: string; imageUrl: string }>({
    mode: "all",
    defaultValues,
  })

  const iconUploader = usePinata({
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

  const {} = useSubmitWithUpload(handleSubmit(onSubmit), iconUploader.isUploading)

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
              <FormControl isInvalid={!!errors?.name}>
                <FormLabel>Name</FormLabel>

                <Input
                  {...register("name", { required: "This field is required" })}
                />

                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors?.description}>
                <FormLabel>Description</FormLabel>

                <Textarea
                  {...register("description", {
                    required: "This field is required",
                  })}
                />

                <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
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
