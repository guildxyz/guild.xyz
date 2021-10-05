import { useEffect, useState } from "react"
import useNftMetadata from "./useNftMetadata"

const useNftCustomAttributeNames = (nftSlug: string) => {
  const [data, setData] = useState([])

  const { isLoading, metadata } = useNftMetadata(nftSlug)

  useEffect(() => {
    setData(nftSlug && metadata ? Object.keys(metadata) : [])
  }, [nftSlug, metadata])

  return { isLoading, data }
}

export default useNftCustomAttributeNames
