import { useEffect, useState } from "react"
import useMetadata from "../NftFormCard/hooks/useMetadata"

const useNftCustomAttributeValues = (nftType: string, pickedAttribute: string) => {
  const [value, setValue] = useState([])
  const metadata = useMetadata(nftType?.toLowerCase())

  useEffect(() => {
    setValue(metadata && pickedAttribute ? metadata[pickedAttribute] : [])
  }, [pickedAttribute, metadata])

  return value
}

export default useNftCustomAttributeValues
