import { BigNumber } from "@ethersproject/bignumber"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import ERC20_ABI from "static/abis/erc20Abi.json"
import useAllowance from "./useAllowance"

const useAllowSpendingTokens = (
  tokenAddress: string,
  contract: string,
  amount: BigNumber
) => {
  const showErrorToast = useShowErrorToast()

  const { mutateAllowance } = useAllowance(tokenAddress, contract)

  const erc20Contract = useContract(tokenAddress, ERC20_ABI, true)

  const contractCall = async () => {
    const approveRes = await erc20Contract?.approve(contract, amount)
    const approved = await approveRes?.wait()
    return approved
  }

  return useSubmit(contractCall, {
    onError: (error) => showErrorToast(error?.code ?? error),
    onSuccess: () => mutateAllowance(),
  })
}

export default useAllowSpendingTokens
