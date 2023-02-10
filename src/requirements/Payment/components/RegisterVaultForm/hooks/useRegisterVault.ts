import { Contract } from "@ethersproject/contracts"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import ERC20_ABI from "static/abis/erc20Abi.json"
import FEE_COLLECTOR_ABI from "static/abis/newFeeCollectorAbi.json"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"

type RegisterVaultParams = {
  owner: string
  token: string
  fee: number
}

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

const useRegisterVault = (onSuccess: (registeredVaultId: string) => void) => {
  const { chainId, account, provider } = useWeb3React()
  const showErrorToast = useShowErrorToast()

  const registerVault = async (data: RegisterVaultParams): Promise<string> => {
    const { owner, token, fee } = data

    if (!owner || !token || !fee) throw new Error("Invalid data")

    const erc20Contract = new Contract(token, ERC20_ABI, provider)

    let tokenDecimals =
      token === NULL_ADDRESS
        ? RPC[Chains[chainId]].nativeCurrency.decimals
        : undefined
    if (token !== NULL_ADDRESS) {
      try {
        tokenDecimals = await erc20Contract?.decimals()
      } catch (_) {
        throw new Error("Couldn't fetch token decimals.")
      }
    }

    let feeInWei
    try {
      feeInWei = parseUnits(fee.toString(), tokenDecimals)
    } catch (_) {
      throw new Error("Couldn't convert fee to WEI.")
    }

    const feeCollectorContract = new Contract(
      FEE_COLLECTOR_CONTRACT[Chains[chainId]],
      FEE_COLLECTOR_ABI,
      provider.getSigner(account).connectUnchecked()
    )

    // TODO: checkbox for multiple payments (3rd param)
    const registerVaultParams = [owner, token, false, feeInWei]

    try {
      await feeCollectorContract.callStatic.registerVault(...registerVaultParams)
    } catch (callStaticRegisterVaultError) {
      throw callStaticRegisterVaultError
    }

    const registerVaultCall = await feeCollectorContract.registerVault(
      ...registerVaultParams
    )
    const registeredVault = await registerVaultCall?.wait()
    const rawVaultId = registeredVault?.events?.find(
      (e) => e.event === "VaultRegistered"
    )?.args?.[0]

    if (!rawVaultId)
      throw new Error("Vault registration error - couldn't find vault ID")

    const vaultId = rawVaultId.toString()
    return vaultId
  }

  return useSubmit<RegisterVaultParams, string>(registerVault, {
    onError: (error) => showErrorToast(error?.message ?? error),
    onSuccess,
  })
}

export default useRegisterVault
