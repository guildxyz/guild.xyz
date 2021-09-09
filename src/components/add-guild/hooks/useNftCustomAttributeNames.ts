import { useEffect, useState } from "react"
import { NftAddressTypePairs } from "temporaryData/nfts"
import bayc from "temporaryData/nfts/metadata/bayc"
import cryptopunks from "temporaryData/nfts/metadata/cryptopunks"
import loot from "temporaryData/nfts/metadata/loot"

const useNftCustomAttributeNames = (nftAddress: string) => {
  const metadata = {
    bayc,
    cryptopunks,
    loot,
  }

  const objectKeysToArray = (object: Record<string, any>) => {
    if (!object) return []

    const array = []
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(object)) {
      array.push(key)
    }

    return array
  }

  const [value, setValue] = useState([])

  useEffect(() => {
    setValue(
      nftAddress ? objectKeysToArray(metadata[NftAddressTypePairs[nftAddress]]) : []
    )
  }, [nftAddress])

  return value
}

export default useNftCustomAttributeNames
