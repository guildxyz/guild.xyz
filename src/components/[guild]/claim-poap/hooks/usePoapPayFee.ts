import { BigNumber } from "@ethersproject/bignumber"
import { TransactionResponse } from "@ethersproject/providers"
import { formatUnits, parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import useFeeCollectorContract, {
  FEE_COLLECTOR_ADDRESS,
} from "hooks/useFeeCollectorContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import ERC20_ABI from "static/abis/erc20Abi.json"
import fetcher from "utils/fetcher"
import processWalletError from "utils/processWalletError"
import useUserPoapEligibility from "./useUserPoapEligibility"

const usePoapPayFee = (
  vaultId: number,
  chainId: number,
  fancyId: string,
  { onSuccess }: UseSubmitOptions = {}
) => {
  const { account } = useWeb3React()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { poap } = usePoap(fancyId)

  const { vaultData } = usePoapVault(vaultId, chainId)

  const {
    data: { decimals },
  } = useTokenData(Chains[chainId], vaultData?.token)
  const { data: userPoapEligibilityData, mutate: mutateUserPoapEligibility } =
    useUserPoapEligibility(poap?.id)

  const feeCollectorContract = useFeeCollectorContract()
  const erc20Contract = useContract(vaultData?.token, ERC20_ABI, true)

  const fetchPayFee = async () => {
    await fetcher(`/api/poap/can-claim/${poap?.id}`).catch((e) => {
      throw new Error(e?.error ?? "An unknown error occurred")
    })

    // Convert fee to the correct unit
    const feeInNumber = +formatUnits(vaultData?.fee ?? "0", decimals ?? 18)
    const fee = parseUnits(feeInNumber.toString(), decimals ?? 18)

    // Approve spending tokens if necessary
    const shouldApprove =
      vaultData?.token !== "0x0000000000000000000000000000000000000000"
    let approved = false
    if (shouldApprove) {
      // Check allowance - so the user doesn't need to approve again
      const allowance = await erc20Contract?.allowance(
        account,
        FEE_COLLECTOR_ADDRESS
      )

      if (allowance?.gte(vaultData?.fee ?? BigNumber.from(0))) approved = true

      if (!approved) {
        const approveRes = await erc20Contract?.approve(FEE_COLLECTOR_ADDRESS, fee)
        approved = await approveRes?.wait()
      }
    }

    if (shouldApprove && !approved)
      return Promise.reject(
        "You must approve spending tokens with Guild's Payment contract."
      )

    // Calling payFee statically first & handling custom Solidity errors
    try {
      await feeCollectorContract?.callStatic?.payFee(vaultId, {
        value: shouldApprove ? 0 : fee,
      })
    } catch (callStaticError) {
      let processedCallStaticError: string

      // Wallet error - e.g. insufficient funds
      if (callStaticError.error) {
        const walletError = processWalletError(callStaticError.error)
        processedCallStaticError = walletError.title
      }

      if (!processedCallStaticError) {
        switch (callStaticError.errorName) {
          case "VaultDoesNotExist":
            processedCallStaticError = "Vault doesn't exist"
            break
          case "TransferFailed":
            processedCallStaticError = "Transfer failed"
            break
          default:
            processedCallStaticError = "Contract error"
        }
      }

      return Promise.reject(processedCallStaticError)
    }

    const payFee = await feeCollectorContract?.payFee(vaultId, {
      value: shouldApprove ? 0 : fee,
    })
    return payFee
  }

  const { isLoading: isTxLoading, onSubmit: onSubmitWait } = useSubmit<
    TransactionResponse,
    any
  >(async (tx) => tx?.wait(), {
    onError: (error) => {
      showErrorToast(error?.data?.message ?? error?.message ?? error)
    },
    onSuccess: () => {
      toast({
        title: "Successful transaction!",
        description: "You can mint your POAP now",
        status: "success",
      })
      onSuccess()
      mutateUserPoapEligibility({ ...userPoapEligibilityData, hasPaid: true })
    },
  })

  const { isLoading, onSubmit } = useSubmit<null, TransactionResponse>(fetchPayFee, {
    onError: (error) => {
      showErrorToast(error?.data?.message ?? error?.message ?? error)
    },
    onSuccess: (tx) => {
      onSubmitWait(tx)
    },
  })

  return {
    onSubmit,
    loadingText:
      (isLoading && "Check your wallet") || (isTxLoading && "Transaction submitted"),
  }
}

export default usePoapPayFee
