import metadata from "constants/metadata"
import { useEffect, useState } from "react"
import { NftAddressTypePairs } from "temporaryData/nfts"

const useNftCustomAttributeValues = (
  nftAddress: string,
  pickedAttribute: string
) => {
  const [value, setValue] = useState([])

  useEffect(() => {
    setValue(
      nftAddress ? metadata[NftAddressTypePairs[nftAddress]][pickedAttribute] : []
    )
  }, [nftAddress, pickedAttribute])

  return value
}

export default useNftCustomAttributeValues
