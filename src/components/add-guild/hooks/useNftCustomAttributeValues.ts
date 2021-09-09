import { useEffect, useState } from "react"
import { NftAddressTypePairs } from "temporaryData/nfts"
import bayc from "temporaryData/nfts/metadata/bayc"
import cryptopunks from "temporaryData/nfts/metadata/cryptopunks"
import loot from "temporaryData/nfts/metadata/loot"

const useNftCustomAttributeValues = (
  nftAddress: string,
  pickedAttribute: string
) => {
  const metadata = {
    bayc,
    cryptopunks,
    loot,
  }

  const [value, setValue] = useState([])

  useEffect(() => {
    setValue(
      nftAddress ? metadata[NftAddressTypePairs[nftAddress]][pickedAttribute] : []
    )
  }, [nftAddress, pickedAttribute])

  return value
}

export default useNftCustomAttributeValues
