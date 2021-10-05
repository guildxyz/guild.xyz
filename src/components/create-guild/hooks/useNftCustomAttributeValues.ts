import { useEffect, useState } from "react"
import useNfts from "../NftFormCard/hooks/useNfts"

const useNftCustomAttributeValues = (nftType: string, pickedAttribute: string) => {
  const [value, setValue] = useState([])
  const { nfts } = useNfts()

  useEffect(() => {
    setValue(
      nfts && pickedAttribute
        ? nfts?.find((nft) => nft.info.type === nftType)?.metadata[pickedAttribute]
        : []
    )
  }, [pickedAttribute, nfts])

  return value
}

export default useNftCustomAttributeValues
