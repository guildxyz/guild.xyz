import useSWR from "swr"

const fetchMetadata = async (nft: string) =>
  fetch(`/api/metadata/${nft}`).then((rawData) => rawData.json())

const useMetadata = (nft: string): Record<string, Array<string>> => {
  const { data } = useSWR(nft, () => fetchMetadata(nft), {
    revalidateOnFocus: false,
  })

  return data
}

export default useMetadata
