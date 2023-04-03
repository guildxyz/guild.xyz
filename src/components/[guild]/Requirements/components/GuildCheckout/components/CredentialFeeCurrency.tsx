import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { Chains, RPC } from "connectors"
import { useMintCredentialContext } from "../MintCredentialContext"
import useCredentialFee from "../hooks/useCredentialFee"
import TokenInfo from "./PaymentCurrencyPicker/components/TokenInfo"

const CredentialFeeCurrency = (): JSX.Element => {
  const lightShade = useColorModeValue("white", "gray.700")
  const borderWidth = useColorModeValue(1, 0)

  const { credentialChain } = useMintCredentialContext()
  const { credentialFee, isCredentialFeeLoading, credentialFeeError } =
    useCredentialFee()
  const formattedCredentialFee = credentialFee
    ? Number(
        formatUnits(credentialFee, RPC[credentialChain].nativeCurrency.decimals)
      )
    : undefined

  return (
    <Stack spacing={3}>
      <Text as="span" fontWeight="bold">
        Payment currency
      </Text>

      <Box
        w="full"
        h="auto"
        p={4}
        bgColor={lightShade}
        borderWidth={borderWidth}
        borderColor="gray.100"
        borderRadius="2xl"
      >
        <TokenInfo
          address={RPC[credentialChain].nativeCurrency.symbol}
          chainId={Chains[credentialChain]}
          requiredAmount={formattedCredentialFee}
          isLoading={isCredentialFeeLoading}
          error={credentialFeeError}
        />
      </Box>
    </Stack>
  )
}

export default CredentialFeeCurrency
