import { Chains } from "chains"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { TokenApiURLs } from "hooks/useTokens"
import fetcher from "utils/fetcher"
import { parseUnits } from "viem"
import { useChainId } from "wagmi"

type RegisterVaultParams = {
  owner: string
  token: string
  fee: number
}

const useRegisterVault = (poapId, { onSuccess }: UseSubmitOptions) => {
  const showErrorToast = useShowErrorToast()

  const chainId = useChainId()
  const feeCollectorContract = useFeeCollectorContract()

  const registerVault = async (data: RegisterVaultParams) => {
    const { owner, token, fee } = data

    const tokensFromJSON = await fetcher(TokenApiURLs[Chains[chainId]][0])
    const tokenDataFromJSON = tokensFromJSON?.tokens?.find(
      (t) => t.address.toLowerCase() === token.toLowerCase()
    )
    const tokenData = await fetcher(
      `/v2/util/chains/${Chains[chainId]}/contracts/${token}/symbol`
    )
    const feeInWei = parseUnits(
      fee?.toString(),
      tokenDataFromJSON?.decimals ?? tokenData?.decimals ?? 18
    )

    const registerVaultCall = await feeCollectorContract.registerVault(
      poapId,
      owner,
      token,
      feeInWei
    )
    const registeredVault = await registerVaultCall?.wait()
    const rawVaultId = registeredVault?.events?.find(
      (e) => e.event === "VaultRegistered"
    )?.args?.[0]

    if (!rawVaultId)
      return Promise.reject("Vault registration error - couldn't find vault ID")

    const vaultId = parseInt(rawVaultId.toString())
    return vaultId
  }

  return useSubmit<RegisterVaultParams, any>(registerVault, {
    onError: (error) => showErrorToast(error?.message ?? error),
    onSuccess,
  })
}

export default useRegisterVault
