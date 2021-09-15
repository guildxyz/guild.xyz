import { useEffect, useState } from "react"
import metadata from "static/metadata"

const useNftCustomAttributeValues = (nftType: string, pickedAttribute: string) => {
  const [value, setValue] = useState([])

  useEffect(() => {
    setValue(nftType && pickedAttribute ? metadata[nftType][pickedAttribute] : [])
  }, [nftType, pickedAttribute])

  return value
}

export default useNftCustomAttributeValues
