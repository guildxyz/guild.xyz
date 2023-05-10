import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"
import GnosisApiUrls from "../gnosisAPiUrls"

const fetchSafeStatus = ([_, address, chainId]) =>
  fetch(`${GnosisApiUrls[chainId]}/safes/${address}`).then(
    async (response: Response) => {
      const res = await response.json?.()
      return response.ok ? res : Promise.reject(res)
    }
  )

const useIsGnosisSafe = (
  address: string
): { isGnosisSafe: boolean; isGnosisSafeLoading: boolean } => {
  const { chainId } = useWeb3React()

  const { data, isValidating } = useSWRImmutable(
    address && chainId && GnosisApiUrls[chainId]
      ? ["gnosisSafe", address, chainId]
      : null,
    fetchSafeStatus
  )

  return { isGnosisSafe: !!data, isGnosisSafeLoading: isValidating }
}

export default useIsGnosisSafe
