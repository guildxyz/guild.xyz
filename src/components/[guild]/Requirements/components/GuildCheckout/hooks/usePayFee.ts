import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import useDatadog from "components/_app/Datadog/useDatadog"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import useEstimateGasFee from "hooks/useEstimateGasFee"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import FEE_COLLECTOR_ABI from "static/abis/newFeeCollectorAbi.json"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"
import processWalletError from "utils/processWalletError"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import useSubmitTransaction from "./useSubmitTransaction"

const payFee = async (feeCollectorContract: Contract, vaultId: number) => {
  if (!feeCollectorContract)
    return Promise.reject("Can't find FeeCollector contract.")

  try {
    await feeCollectorContract.callStatic.payFee(vaultId)
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
        case "AlreadyPaid":
          processedCallStaticError = "You've already paid to this vault"
          break
        default:
          processedCallStaticError = "Contract error"
      }
    }

    return Promise.reject(processedCallStaticError)
  }

  return feeCollectorContract.payFee(vaultId)
}

const usePayFee = () => {
  const { addDatadogAction, addDatadogError } = useDatadog()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { chainId } = useWeb3React()

  const { requirement } = useGuildCheckoutContext()

  const feeCollectorContract = useContract(
    FEE_COLLECTOR_CONTRACT[Chains[chainId]],
    FEE_COLLECTOR_ABI,
    true
  )

  const { estimatedGasFee, estimatedGasFeeInUSD, estimateGasError } =
    useEstimateGasFee(
      requirement?.id?.toString(),
      requirement?.chain === Chains[chainId] ? feeCollectorContract : null,
      "payFee",
      [requirement.data.id]
    )

  const payFeeTransaction = (vaultId: number) =>
    payFee(feeCollectorContract, vaultId)

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
