import { useEffect, useState } from "react"
import useNfts from "../NftFormCard/hooks/useNfts"

const objectKeysToArray = (object: Record<string, any>) => {
  if (!object) return []

  const array = []
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(object)) {
    array.push(key)
  }

  return array
}

const useNftCustomAttributeNames = (nftType: string) => {
  const [value, setValue] = useState([])

  const { nfts } = useNfts()

  useEffect(() => {
    setValue(
      nftType
        ? objectKeysToArray(nfts?.find((nft) => nft.info.type === nftType)?.metadata)
        : []
    )
  }, [nftType, nfts])

  return value
}

export default useNftCustomAttributeNames
