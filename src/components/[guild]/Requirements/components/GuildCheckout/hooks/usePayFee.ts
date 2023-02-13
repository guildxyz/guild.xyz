import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import useDatadog from "components/_app/Datadog/useDatadog"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import useEstimateGasFee from "hooks/useEstimateGasFee"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import FEE_COLLECTOR_ABI from "static/abis/newFeeCollectorAbi.json"
import {
  ADDRESS_REGEX,
  FEE_COLLECTOR_CONTRACT,
  NULL_ADDRESS,
} from "utils/guildCheckout/constants"
import processWalletError from "utils/processWalletError"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import useAllowance from "./useAllowance"
import useSubmitTransaction from "./useSubmitTransaction"

const payFee = async (
  feeCollectorContract: Contract,
  params: [number, Record<string, any>]
) => {
  if (!feeCollectorContract)
    return Promise.reject("Can't find FeeCollector contract.")

  try {
    await feeCollectorContract.callStatic.payFee(...params)
  } catch (callStaticError) {
    let processedCallStaticError: string

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
        case "AlreadyPaid":
          processedCallStaticError = "You've already paid to this vault"
          break
        default:
          processedCallStaticError = "Contract error"
      }
    }

    return Promise.reject(processedCallStaticError)
  }

  return feeCollectorContract.payFee(...params)
}

const usePayFee = () => {
  const { addDatadogAction, addDatadogError } = useDatadog()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { chainId } = useWeb3React()

  const { requirement, pickedCurrency } = useGuildCheckoutContext()

  const feeCollectorContract = useContract(
    FEE_COLLECTOR_CONTRACT[Chains[chainId]],
    FEE_COLLECTOR_ABI,
    true
  )

  const {
    data: { token, fee, multiplePayments },
    isValidating: isVaultLoading,
  } = useVault(requirement.data.id, requirement.chain)

  const { data: hasPaid, isValidating: isHasPaidLoading } = useHasPaid(
    requirement.data.id,
    requirement.chain
  )

  const extraParam = {
    value: token === NULL_ADDRESS ? fee : undefined,
  }

  const { allowance } = useAllowance(
    pickedCurrency,
    FEE_COLLECTOR_CONTRACT[Chains[chainId]]
  )

  const shouldEstimateGas =
    requirement?.chain === Chains[chainId] &&
    !isVaultLoading &&
    !isHasPaidLoading &&
    (multiplePayments || !hasPaid) &&
    fee &&
    (ADDRESS_REGEX.test(pickedCurrency) ? allowance && fee.lte(allowance) : true)

  const { estimatedGasFee, estimatedGasFeeInUSD, estimateGasError } =
    useEstimateGasFee(
      requirement?.id?.toString(),
      shouldEstimateGas ? feeCollectorContract : null,
      "payFee",
      [requirement.data.id, extraParam]
    )

  const payFeeTransaction = (vaultId: number) =>
    payFee(feeCollectorContract, [vaultId, extraParam])

  const useSubmitData = useSubmitTransaction<number>(payFeeTransaction, {
    onError: (error) => {
      showErrorToast(error)
      addDatadogError("general payFee error (GuildCheckout)")
      addDatadogError("payFee pre-call error (GuildCheckout)", {
        error,
      })
    },
    onSuccess: (receipt) => {
      if (receipt.status !== 1) {
        showErrorToast("Transaction failed")
        addDatadogError("general payFee error (GuildCheckout)")
        addDatadogError("payFee error (GuildCheckout)", {
          receipt,
        })
        return
      }

      addDatadogAction("successful payFee (GuildCheckout)")
      toast({
        status: "success",
        title: "Successful payment",
      })
    },
  })

  return {
    ...useSubmitData,
    onSubmit: () => useSubmitData.onSubmit(requirement.data.id),
    estimatedGasFee,
    estimatedGasFeeInUSD,
    estimateGasError,
  }
}

export default usePayFee
