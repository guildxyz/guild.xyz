import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const useClearUrlQuery = () => {
  const router = useRouter()
  const [query, setQuery] = useState(router.query)

  useEffect(() => {
    if (router.isReady && router.asPath.includes("?")) {
      setQuery(router.query)

      router.replace(window.location.href.split("?")[0], undefined, {
        shallow: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  return query
}

export default useClearUrlQuery
