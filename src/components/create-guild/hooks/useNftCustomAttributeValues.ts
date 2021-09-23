import { useEffect, useState } from "react"
import useNftsList from "../NftFormCard/hooks/useNftsList"

const useNftCustomAttributeValues = (nftType: string, pickedAttribute: string) => {
  const [value, setValue] = useState([])
  const nftsList = useNftsList()

  useEffect(() => {
    setValue(
      nftsList && pickedAttribute
        ? nftsList?.find((nft) => nft.info.type === nftType)?.metadata[
            pickedAttribute
          ]
        : []
    )
  }, [pickedAttribute, nftsList])

  return value
}

export default useNftCustomAttributeValues
