import { useEffect, useState } from "react"
import metadata from "static/metadata"
import { NftAddressTypePairs } from "temporaryData/nfts"

const useNftCustomAttributeValues = (
  nftAddress: string,
  pickedAttribute: string
) => {
  const [value, setValue] = useState([])

  useEffect(() => {
    setValue(
      nftAddress && pickedAttribute
        ? metadata[NftAddressTypePairs[nftAddress]][pickedAttribute]
        : []
    )
  }, [nftAddress, pickedAttribute])

  return value
}

export default useNftCustomAttributeValues
