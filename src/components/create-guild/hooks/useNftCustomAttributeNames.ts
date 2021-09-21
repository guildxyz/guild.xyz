import { useEffect, useState } from "react"
import useMetadata from "../NftFormCard/hooks/useMetadata"

const objectKeysToArray = (object: Record<string, any>) => {
  if (!object) return []

  const array = []
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(object)) {
    array.push(key)
  }

  return array
}

const useNftCustomAttributeNames = (nftType: string) => {
  const [value, setValue] = useState([])

  const metadata = useMetadata(nftType.toLowerCase())

  useEffect(() => {
    setValue(nftType ? objectKeysToArray(metadata) : [])
  }, [nftType, metadata])

  return value
}

export default useNftCustomAttributeNames
