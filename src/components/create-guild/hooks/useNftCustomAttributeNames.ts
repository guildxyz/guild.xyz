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
  const [data, setData] = useState([])

  const { isLoading, metadata } = useNftMetadata(nftSlug)

  useEffect(() => {
    setData(nftSlug ? objectKeysToArray(metadata) : [])
  }, [nftSlug, metadata])

  return { isLoading, data }
}

export default useNftCustomAttributeNames
