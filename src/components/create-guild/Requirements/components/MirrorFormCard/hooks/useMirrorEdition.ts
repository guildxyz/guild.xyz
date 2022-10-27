import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchMirrorEdition = (_: string, address: string) =>
  fetcher(`https://api.qx.app/api/v1/collection/${address}`, {
    headers: {
      "X-API-KEY": process.env.QX_API_KEY,
    },
  })

const useMirrorEdition = (
  address: string
): { name: string; image: string; isLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    address ? ["mirrorEdition", address] : null,
    fetchMirrorEdition
  )

  return {
    name: data?.name,
    image: data?.image_url,
    isLoading: isValidating,
  }
}

export default useMirrorEdition
