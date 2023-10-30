import { CHAIN_CONFIG, Chain, Chains } from "chains"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import feeCollectorAbi from "static/abis/feeCollector"
import { FEE_COLLECTOR_CONTRACT, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { parseUnits } from "viem"
import { useChainId, useToken } from "wagmi"

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
    enabled: Boolean(token && token !== NULL_ADDRESS && chain),
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
      enabled: Boolean(feeInWei && chainId === Chains[chain]),
    },
    {
      onError: (errorMessage, error) => {
        showErrorToast(errorMessage)
        captureEvent("Register vault error", {
          error,
        })
      },
      onSuccess: (_, events) => {
        const vaultRegisteredEvent: {
          eventName: "VaultRegistered"
          args: {
            fee: bigint
            owner: `0x${string}`
            token: `0x${string}`
            vaultId: bigint
          }
        } = events.find((event) => event.eventName === "VaultRegistered")

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
