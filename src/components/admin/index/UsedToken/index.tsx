import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ValidationError from "components/admin/common/ValidationError"
import slugify from "components/admin/utils/slugify"
import NetworkChangeModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import { Chains, RPC } from "connectors"
import Image from "next/image"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useTokenData from "./hooks/useTokenData"

const UsedToken = (): JSX.Element => {
  const {
    register,
    formState: { errors, touchedFields },
    setValue,
    trigger,
  } = useFormContext()
  const { chainId } = useWeb3React()

  const tokenAddress = useWatch({ name: "tokenAddress" })
  const selectedChain = useWatch({ name: "chainName" })
  const communityName = useWatch({ name: "name" })
  const urlName = useWatch({ name: "urlName" })

  const {
    data: [tokenName, tokenSymbol],
    isValidating: isTokenSymbolValidating,
    error,
  } = useTokenData(tokenAddress, selectedChain)

  useEffect(() => {
    if (tokenName !== undefined) {
      setValue("name", communityName || tokenName)
      setValue("urlName", urlName || slugify(tokenName))
    }
  }, [tokenName])

  useEffect(() => {
    setValue("chainName", Chains[chainId])
  }, [chainId, setValue, tokenAddress])

  useEffect(() => {
    if (touchedFields.tokenAddress) trigger("tokenAddress")
  }, [isTokenSymbolValidating, error, trigger, touchedFields])

  const { colorMode } = useColorMode()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <FormControl isRequired>
        <FormLabel>Token address</FormLabel>
        <Stack direction={{ base: "column", md: "row" }} mt={4} spacing={2}>
          <Button
            variant="ghost"
            colorScheme="gray"
            px={6}
            height={10}
            bgColor={colorMode === "light" ? "gray.100" : "whiteAlpha.200"}
            width={{ base: "full", md: "max-content" }}
            onClick={onOpen}
          >
            <HStack>
              <Box position="relative" width={4} height={4}>
                <Image
                  alt={`${RPC[Chains[chainId]].chainName} icon`}
                  src={RPC[Chains[chainId]].iconUrls[0]}
                  layout="fill"
                />
              </Box>
              <Text as="span" fontSize="sm">
                {RPC[Chains[chainId]].chainName}
              </Text>
            </HStack>
          </Button>
          <InputGroup>
            <Input
              {...register("tokenAddress", {
                required: "This field is required.",
                pattern: {
                  value: /^0x[A-F0-9]{40}$/i,
                  message:
                    "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                },
                validate: () =>
                  isTokenSymbolValidating ||
                  !error ||
                  "Failed to fetch symbol. Please switch to the correct network.",
              })}
              isInvalid={errors.tokenAddress}
            />
            {((!error && tokenSymbol !== undefined) || isTokenSymbolValidating) && (
              <InputRightAddon fontSize={{ base: "xs", sm: "md" }}>
                {tokenSymbol === undefined && isTokenSymbolValidating ? (
                  <HStack px={4} alignContent="center">
                    <Spinner size="sm" color="blackAlpha.400" />
                  </HStack>
                ) : (
                  tokenSymbol
                )}
              </InputRightAddon>
            )}
          </InputGroup>
        </Stack>
        <ValidationError fieldName="tokenAddress" />
      </FormControl>

      <NetworkChangeModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default UsedToken
