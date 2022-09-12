import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains } from "connectors"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { useCreatePoapContext } from "../../CreatePoapContext"

type RegisterVaultParams = {
  owner: string
  token: string
  fee: number
}

const useRegisterVault = (callback?: () => void) => {
  const { mutateGuild } = useGuild()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { poapData } = useCreatePoapContext()

  const { chainId } = useWeb3React()
  const feeCollectorContract = useFeeCollectorContract()

  const registerVault = async (data: RegisterVaultParams) => {
    const { owner, token, fee } = data

    const tokenData = await fetcher(`/util/symbol/${token}/${Chains[chainId]}`)
    const feeInWei = parseUnits(fee?.toString(), tokenData?.decimals ?? 18)

    const registerVaultCall = await feeCollectorContract.registerVault(
      poapData?.id,
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

    return fetcher("/assets/poap/monetize", {
      body: {
        poapId: poapData?.id,
        vaultId,
        chainId,
        contract: feeCollectorContract.address,
      },
    })
  }

  return useSubmit<RegisterVaultParams, any>(registerVault, {
    onError: (error) => showErrorToast(error?.message ?? error),
    onSuccess: () => {
      mutateGuild()
      toast({
        title: "Successfully created vault",
        status: "success",
      })
      callback?.()
    },
  })
}

export default useRegisterVault
