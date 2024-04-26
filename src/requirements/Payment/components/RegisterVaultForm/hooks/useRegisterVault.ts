import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import useToken from "hooks/useToken"
import feeCollectorAbi from "static/abis/feeCollector"
import { findEvent } from "utils/findEventInTxResponse"
import { FEE_COLLECTOR_CONTRACT, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { parseUnits } from "viem"
import { useChainId } from "wagmi"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"

type RegisterVaultParams = {
  owner: `0x${string}`
  token: `0x${string}`
  fee: number
  chain: Chain
}

const useRegisterVault = ({
  chain,
  token,
  fee,
  owner,
  onSuccess,
}: RegisterVaultParams & { onSuccess: (registeredVaultId: string) => void }) => {
  const { captureEvent } = usePostHogContext()
  const chainId = useChainId()

  const showErrorToast = useShowErrorToast()

  const { data: tokenData } = useToken({
    address: token,
    chainId: Chains[chain],
    shouldFetch: Boolean(token !== NULL_ADDRESS && chain),
  })
  const tokenDecimals =
    token === NULL_ADDRESS
      ? CHAIN_CONFIG[Chains[chainId]].nativeCurrency.decimals
      : tokenData?.decimals
  const feeInWei =
    fee && tokenDecimals ? parseUnits(fee.toString(), tokenDecimals) : undefined

  const registerVaultParams = [owner, token, false, BigInt(feeInWei ?? 0)] as const

  return useSubmitTransaction(
    {
      abi: feeCollectorAbi,
      address: FEE_COLLECTOR_CONTRACT[Chains[chainId]],
      functionName: "registerVault",
      args: registerVaultParams,
      chainId: Chains[chain],
      query: {
        enabled: Boolean(feeInWei && chainId === Chains[chain]),
      },
    },
    {
      setContext: false,
      onError: (errorMessage, error) => {
        showErrorToast(errorMessage)
        captureEvent("Register vault error", {
          error,
        })
      },
      onSuccess: (_, events) => {
        if (process.env.NEXT_PUBLIC_MOCK_CONNECTOR) {
          onSuccess("0")
          return
        }

        const vaultRegisteredEvent = findEvent<
          typeof feeCollectorAbi,
          "VaultRegistered"
        >(events as [], "VaultRegistered")

        if (!vaultRegisteredEvent) {
          showErrorToast("Couldn't find 'VaultRegistered' event")
          return
        }

        onSuccess(vaultRegisteredEvent.args.vaultId.toString())
      },
    }
  )
}

export default useRegisterVault
