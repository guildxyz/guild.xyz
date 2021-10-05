import { useEffect, useState } from "react"
import useNftsList from "../NftFormCard/hooks/useNftsList"

const useNftCustomAttributeValues = (nftType: string, pickedAttribute: string) => {
  const [value, setValue] = useState([])
  const { nfts } = useNftsList()

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
