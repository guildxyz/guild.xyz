import { useEffect, useState } from "react"
import useNftsList from "../NftFormCard/hooks/useNftsList"

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

  const { nfts: nftsList } = useNftsList()

  useEffect(() => {
    setValue(
      nftType
        ? objectKeysToArray(
            nftsList?.find((nft) => nft.info.type === nftType)?.metadata
          )
        : []
    )
  }, [nftType, nftsList])

  return value
}

export default useNftCustomAttributeNames
