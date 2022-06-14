import { parseUnits } from "@ethersproject/units"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
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

  const feeCollectorContract = useContract(
    "0xCc1EAfB95D400c1E762f8D4C85F1382343787D7C",
    FEE_COLLECTOR_ABI,
    true
  )

  const registerVault = async (data: RegisterVaultParams) => {
    const { owner, token, fee } = data

    // Convert fee to wei
    const feeInWei = parseUnits(fee?.toString(), 18)

    console.log(
      `Calling: registerVault(${poapData?.id}, ${owner}, ${token}, ${feeInWei})`
    )

    // TODO: if the user picks an ERC20 token, they should allow the contract to use that token

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
