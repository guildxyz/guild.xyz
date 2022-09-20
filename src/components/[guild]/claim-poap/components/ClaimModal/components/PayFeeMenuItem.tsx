import {
  Circle,
  HStack,
  Img,
  MenuItem,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import requestNetworkChange from "components/common/Layout/components/Account/components/NetworkModal/utils/requestNetworkChange"
import usePayFee from "components/[guild]/claim-poap/hooks/usePayFee"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { Chains, RPC } from "connectors"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { useEffect } from "react"
import { PoapContract } from "types"

type Props = {
  poapContractData: PoapContract
  setLoadingText: (newLoadingText: string) => void
}

const PayFeeMenuItem = ({
  poapContractData,
  setLoadingText,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  const { connector, chainId } = useWeb3React()
  const toast = useToast()

  const { vaultData } = usePoapVault(
    poapContractData.vaultId,
    poapContractData.chainId
  )
  const {
    data: { symbol, decimals },
    isValidating,
  } = useTokenData(Chains[poapContractData.chainId], vaultData?.token)
  const formattedPrice = formatUnits(vaultData?.fee ?? "0", decimals ?? 18)

  const { onSubmit, loadingText } = usePayFee(
    poapContractData.vaultId,
    poapContractData.chainId
  )

  useEffect(() => setLoadingText(loadingText), [loadingText])

  const handleChainChange = () => {
    if (connector instanceof WalletConnect || connector instanceof CoinbaseWallet) {
      toast({
        title: "Your wallet doesn't support switching chains automatically",
        description: `Please switch to ${
          RPC[Chains[poapContractData.chainId]]?.chainName
        } from your wallet manually!`,
        status: "error",
      })
      return
    }

    requestNetworkChange(Chains[poapContractData.chainId])()
  }

  return (
    <MenuItem
      onClick={chainId === poapContractData.chainId ? onSubmit : handleChainChange}
      tabIndex={0}
    >
      <Stack w="full" justifyContent="space-between" direction="row" fontSize="sm">
        <HStack>
          <SkeletonCircle boxSize={5} isLoaded={!isValidating}>
            <Circle size={5} bgColor={colorMode === "light" ? "white" : "gray.100"}>
              <Img
                src={RPC[Chains[poapContractData.chainId]]?.iconUrls?.[0]}
                alt={RPC[Chains[poapContractData.chainId]]?.chainName}
                boxSize={3}
              />
            </Circle>
          </SkeletonCircle>
          <Skeleton isLoaded={!isValidating}>
            <Text as="span" pr={4}>
              {isValidating ? "Pay fee" : `Pay ${formattedPrice} ${symbol}`}
            </Text>
          </Skeleton>
        </HStack>

        <Text as="span" color="gray">
          {` on ${RPC[Chains[poapContractData.chainId]]?.chainName}`}
        </Text>
      </Stack>
    </MenuItem>
  )
}

export default PayFeeMenuItem
