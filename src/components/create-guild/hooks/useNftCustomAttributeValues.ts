import { useEffect, useState } from "react"
import useNftMetadata from "./useNftMetadata"

const useNftCustomAttributeValues = (nftSlug: string, pickedAttribute: string) => {
  const [value, setValue] = useState([])
  const metadata = useNftMetadata(nftSlug)

  useEffect(() => {
    setValue(metadata && pickedAttribute ? metadata[pickedAttribute] : [])
  }, [pickedAttribute, metadata])

  return value
}

export default useNftCustomAttributeValues
