import { usePostHogContext } from "@/components/Providers/PostHogProvider"
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
  fee: string
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
      ? CHAIN_CONFIG[Chains[chainId] as Chain].nativeCurrency.decimals
      : tokenData?.decimals

  const feeInWei = fee && tokenDecimals ? parseUnits(fee, tokenDecimals) : undefined

  const registerVaultParams = [owner, token, false, BigInt(feeInWei ?? 0)] as const

  return useSubmitTransaction(
    {
      abi: feeCollectorAbi,
      address:
        FEE_COLLECTOR_CONTRACT[
          Chains[chainId] as keyof typeof FEE_COLLECTOR_CONTRACT
        ],
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
