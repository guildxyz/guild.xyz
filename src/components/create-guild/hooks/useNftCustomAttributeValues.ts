import { useEffect, useState } from "react"
import useNftsList from "../NftFormCard/hooks/useNftsList"

const useNftCustomAttributeValues = (nftSlug: string, pickedAttribute: string) => {
  const [value, setValue] = useState([])
  const nftsList = useNftsList()

  useEffect(() => {
    setValue(
      nftsList && pickedAttribute
        ? nftsList?.find((nft) => nft.info.slug === nftSlug)?.metadata[
            pickedAttribute
          ]
        : []
    )
  }, [pickedAttribute, nftsList])

  return value
}

export default useNftCustomAttributeValues
