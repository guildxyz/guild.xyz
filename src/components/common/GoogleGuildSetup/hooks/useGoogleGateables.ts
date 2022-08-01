import useKeyPair from "hooks/useKeyPair"
import useSWR from "swr"
import { GoogleFile } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useGoogleGateables = () => {
  const { keyPair, ready } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const { data, isValidating } = useSWR<GoogleFile[]>(
    ready && keyPair
      ? [
          "/guild/listGateables",
          { method: "POST", body: { platformName: "GOOGLE" } },
        ]
      : null,
    fetcherWithSign
  )

  return {
    isGoogleGateablesLoading: !data && isValidating,
    googleGateables: data,
  }
}

export default useGoogleGateables
