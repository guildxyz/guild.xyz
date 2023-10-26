import { CHAIN_CONFIG, Chain, Chains } from "chains"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import feeCollectorAbi from "static/abis/feeCollector"
import { FEE_COLLECTOR_CONTRACT, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { TransactionReceipt, decodeEventLog, parseUnits } from "viem"
import { erc20ABI, useChainId, usePublicClient, useWalletClient } from "wagmi"

type RegisterVaultParams = {
  owner: `0x${string}`
  token: `0x${string}`
  fee: number
  chain: Chain
}

const useRegisterVault = (onSuccess: (registeredVaultId: string) => void) => {
  const { captureEvent } = usePostHogContext()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const showErrorToast = useShowErrorToast()

  const registerVault = async (data: RegisterVaultParams): Promise<string> => {
    const { owner, token, fee, chain } = data

    if (!owner || !token || !fee) throw new Error("Invalid data")

    let tokenDecimals: number

    if (token === NULL_ADDRESS) {
      tokenDecimals = CHAIN_CONFIG[Chains[chainId]].nativeCurrency.decimals
    } else {
      try {
        tokenDecimals = await publicClient.readContract({
          abi: erc20ABI,
          address: token,
          functionName: "decimals",
        })
      } catch {
        throw new Error("Couldn't fetch token decimals.")
      }
    }

    let feeInWei
    try {
      feeInWei = parseUnits(fee.toString(), tokenDecimals)
    } catch (_) {
      throw new Error("Couldn't convert fee to WEI.")
    }

    // TODO: checkbox for multiple payments (3rd param) - will add it in a later PR
    const registerVaultParams = [owner, token, false, BigInt(feeInWei)] as const

    const { request } = await publicClient.simulateContract({
      abi: feeCollectorAbi,
      address: FEE_COLLECTOR_CONTRACT[Chains[chainId]],
      functionName: "registerVault",
      args: registerVaultParams,
      chainId: Chains[chain],
      enabled: chainId === Chains[chain],
    })

    const hash = await walletClient.writeContract({
      ...request,
      account: walletClient.account,
    })

    const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt(
      { hash }
    )

    if (receipt.status !== "success") {
      throw new Error(`Transaction failed. Hash: ${hash}`)
    }

    const events = receipt.logs
      .map((log) => {
        try {
          return decodeEventLog({
            abi: feeCollectorAbi,
            data: log.data,
            // I think there's a missing property on the TransactionReceipt type
            topics: (log as any).topics,
          })
        } catch {
          return null
        }
      })
      .filter(Boolean)

    const vaultRegisteredEvent: {
      eventName: "VaultRegistered"
      args: {
        fee: bigint
        owner: `0x${string}`
        token: `0x${string}`
        vaultId: bigint
      }
    } = events.find((event) => event.eventName === "VaultRegistered")

    if (!vaultRegisteredEvent)
      throw new Error("Couldn't find 'VaultRegistered' event")

    return vaultRegisteredEvent.args.vaultId.toString()
  }

  return useSubmit<RegisterVaultParams, string>(registerVault, {
    onError: (error: any) => {
      showErrorToast(error?.shortMessage ?? error)
      captureEvent("Register vault error", {
        error,
      })
    },
    onSuccess,
  })
}

export default useRegisterVault
