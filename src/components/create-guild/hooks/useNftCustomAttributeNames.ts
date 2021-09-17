import metadata from "constants/metadata"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    setValue(nftType ? objectKeysToArray(metadata[nftType]) : [])
  }, [nftType])

  return value
}

export default useNftCustomAttributeNames
