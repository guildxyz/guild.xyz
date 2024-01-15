import type { CoinbasePayTxStatus } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import { useKeyPair } from "components/_app/KeyPairProvider"
import useSWR from "swr"
import { useFetcherWithSign } from "utils/fetcher"

const useCoinbasePayStatus = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { keyPair, isValid } = useKeyPair()
  const { id } = useUser()

  const shouldFetch = !!keyPair && isValid

  // `/v2/third-party/coinbase/pay/status`
  const payStatus = useSWR<CoinbasePayTxStatus>(
    shouldFetch ? `/api/temp-pay-status?userId=${id}` : null,
    (url) => fetcherWithSign([url, { method: "GET", signOptions: { method: 2 } }]),
    { refreshInterval: 5000, onSuccess: (data) => console.log(data) }
  )

  return payStatus
}

export default useCoinbasePayStatus
