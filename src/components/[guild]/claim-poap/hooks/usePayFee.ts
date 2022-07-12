import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import useFeeCollectorContract, {
  FEE_COLLECTOR_ADDRESS,
} from "hooks/useFeeCollectorContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { useRouter } from "next/router"
import ERC20_ABI from "static/abis/erc20Abi.json"
import useHasPaid from "./useHasPaid"

const usePayFee = () => {
  const { chainId } = useWeb3React()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const router = useRouter()
  const { poap } = usePoap(router.query.fancyId?.toString())

  const { vaultData } = usePoapVault(poap?.id)
  const {
    data: { decimals },
  } = useTokenData(Chains[chainId], vaultData?.token)
  const { mutate: mutateHasPaid } = useHasPaid()

  const feeCollectorContract = useFeeCollectorContract()
  const erc20Contract = useContract(vaultData?.token, ERC20_ABI, true)

  const fetchPayFee = async () => {
    // Convert fee to the correct unit
    const fee = FixedNumber.from(
      formatUnits(vaultData?.fee?.toString() ?? "0", decimals ?? 18)
    )

    // Approve spending tokens if necessary
    const shouldApprove =
      vaultData?.token !== "0x0000000000000000000000000000000000000000"
    let approved = false
    if (shouldApprove) {
      // This is the FeeCollector contract address
      const approveRes = await erc20Contract?.approve(FEE_COLLECTOR_ADDRESS, fee)
      approved = await approveRes?.wait()
    }

    if (shouldApprove && !approved)
      return Promise.reject(
        "You must approve spending tokens with the Guild.xyz FeeCollector contract."
      )

    const payFee = await feeCollectorContract?.payFee(vaultData?.id, {
      value: shouldApprove ? 0 : fee,
    })
    return payFee?.wait()
  }

  return useSubmit<null, any>(fetchPayFee, {
    onError: (error) => {
      showErrorToast(error?.message ?? error)
    },
    onSuccess: () => {
      toast({
        title: "Successful transaction!",
        description: "You'll be able to claim your POAP shortly!",
        status: "success",
      })
      mutateHasPaid(true)
    },
  })
}

export default usePayFee
