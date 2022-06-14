import { parseUnits } from "@ethersproject/units"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCreatePoapContext } from "../../CreatePoapContext"

type RegisterVaultParams = {
  owner: string
  token: string
  fee: number
}

const useRegisterVault = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { poapData } = useCreatePoapContext()

  const feeCollectorContract = useFeeCollectorContract()

  const registerVault = async (data: RegisterVaultParams) => {
    const { owner, token, fee } = data

    // Convert fee to wei
    const feeInWei = parseUnits(fee?.toString(), 18)

    const registerVaultCall = await feeCollectorContract.registerVault(
      poapData?.id,
      owner,
      token,
      feeInWei
    )
    return registerVaultCall?.wait()

    // TODO: save the vault ID to the DB
  }

  return useSubmit<RegisterVaultParams, any>(registerVault, {
    onError: (error) => {
      showErrorToast(error?.message ?? error)
    },
    onSuccess: (response) => {
      console.log("SUCCESS", response)

      // The "VaultRegistered" event will be in `response.events?.find(e => e.event === "VaultRegistered")`

      toast({
        title: "Successfully created vault",
        status: "success",
      })
    },
  })
}

export default useRegisterVault
