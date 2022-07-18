import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import { useRouter } from "next/router"
import useSWR, { KeyedMutator } from "swr"

const fetchHasPaid = (
  _: string,
  contract: Contract,
  vaultId: number,
  account: string
) => contract.hasPaid(vaultId, account)

const useHasPaid = (): {
  hasPaid: boolean
  hasPaidLoading: boolean
  mutate: KeyedMutator<any>
} => {
  const router = useRouter()
  const { chainId } = useWeb3React()

  const { poap } = usePoap(router.query.fancyId?.toString())

  const { vaultData, isVaultLoading } = usePoapVault(poap?.id, chainId)

  const feeCollectorContract = useFeeCollectorContract()
  const { account } = useWeb3React()

  const shouldFetch =
    !isVaultLoading &&
    typeof vaultData?.id === "number" &&
    feeCollectorContract &&
    account

  const {
    data: hasPaid,
    isValidating: hasPaidLoading,
    mutate,
  } = useSWR(
    shouldFetch ? ["hasPaid", feeCollectorContract, vaultData.id, account] : null,
    fetchHasPaid
  )

  return { hasPaid, hasPaidLoading, mutate }
}

export default useHasPaid
