import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useCredentialFee from "../hooks/useCredentialFee"
import FeesTable from "./FeesTable"
import PriceFallback from "./PriceFallback"

const CredentialFees = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { credentialFee, credentialFeeError, isCredentialFeeLoading } =
    useCredentialFee()
  const credentialFeeInFloat =
    credentialFee &&
    parseFloat(
      formatUnits(credentialFee, RPC[Chains[chainId]].nativeCurrency.decimals)
    )

  const symbol = RPC[Chains[chainId]].nativeCurrency.symbol

  return (
    <FeesTable
      buttonComponent={
        <HStack justifyContent={"space-between"} w="full">
          <Text fontWeight={"medium"}>Minting fee:</Text>

          <PriceFallback pickedCurrency={symbol} error={credentialFeeError}>
            <Text as="span">
              <Skeleton isLoaded={!isCredentialFeeLoading}>
                <Text as="span">
                  {credentialFeeInFloat
                    ? `${Number(credentialFeeInFloat.toFixed(3))} `
                    : "0.00 "}
                  {symbol}
                </Text>
                <Text as="span" colorScheme="gray">
                  {` + gas`}
                </Text>
              </Skeleton>
            </Text>
          </PriceFallback>
        </HStack>
      }
    >
      <Tr>
        <Td>Price</Td>
        <Td isNumeric>Free</Td>
      </Tr>

      <Tr>
        <Td>Minting fee</Td>
        <Td isNumeric>
          <Skeleton isLoaded={!!credentialFeeInFloat}>
            {credentialFeeInFloat
              ? `${Number(credentialFeeInFloat.toFixed(3))} ${symbol}`
              : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      {/* <Tr>
        <Td>Gas fee</Td>
        <Td isNumeric>Can't calculate in advance</Td>
      </Tr> */}

      <Tr>
        <Td>Total</Td>
        <Td isNumeric color="WindowText">
          {`${
            credentialFeeInFloat
              ? `${Number(credentialFeeInFloat.toFixed(3))} `
              : "0.00 "
          } ${symbol}`}{" "}
          + gas
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default CredentialFees
