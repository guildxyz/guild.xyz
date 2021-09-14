import { useEffect, useState } from "react"
import metadata from "static/metadata"
import { NftAddressTypePairs } from "temporaryData/nfts"

const objectKeysToArray = (object: Record<string, any>) => {
  if (!object) return []

  const array = []
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(object)) {
    array.push(key)
  }

  return array
}

const useNftCustomAttributeNames = (nftAddress: string) => {
  const [value, setValue] = useState([])

  useEffect(() => {
    setValue(
      nftAddress ? objectKeysToArray(metadata[NftAddressTypePairs[nftAddress]]) : []
    )
  }, [nftAddress])

  return value
}

export default useNftCustomAttributeNames
