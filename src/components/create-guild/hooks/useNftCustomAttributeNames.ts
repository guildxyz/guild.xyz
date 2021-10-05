import { useEffect, useState } from "react"
import useNftMetadata from "./useNftMetadata"

const objectKeysToArray = (object: Record<string, any>) => {
  if (!object) return []

  const array = []
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(object)) {
    array.push(key)
  }

  return array
}

const useNftCustomAttributeNames = (nftSlug: string) => {
  const [value, setValue] = useState([])

  const metadata = useNftMetadata(nftSlug)

  useEffect(() => {
    setValue(nftSlug ? objectKeysToArray(metadata) : [])
  }, [nftSlug, metadata])

  return value
}

export default useNftCustomAttributeNames
