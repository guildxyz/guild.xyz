import { useEffect, useState } from "react"
import useNftsList from "../NftFormCard/hooks/useNftsList"

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

  const nftsList = useNftsList()

  useEffect(() => {
    setValue(
      nftSlug
        ? objectKeysToArray(
            nftsList?.find((nft) => nft.info.slug === nftSlug)?.metadata
          )
        : []
    )
  }, [nftSlug, nftsList])

  return value
}

export default useNftCustomAttributeNames
