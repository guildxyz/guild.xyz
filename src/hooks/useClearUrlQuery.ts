import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const useClearUrlQuery = () => {
  const router = useRouter()
  const [query, setQuery] = useState(router.query)

  useEffect(() => {
    if (router.isReady) {
      setQuery(router.query)
      router.replace(window.location.href.split("?")[0], undefined, {
        shallow: true,
      })
    }
  }, [router.isReady])

  return query
}

export default useClearUrlQuery
