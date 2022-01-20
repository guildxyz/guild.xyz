import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

export const useQueryState = <State extends string>(
  name: string,
  defaultState: State
) => {
  const router = useRouter()

  const getInitialState = () => {
    const queries = router.query[name]
    const query = Array.isArray(queries) ? queries[0] : queries
    return query ? (query as State) : defaultState
  }

  const [state, setState] = useState(getInitialState)

  useEffect(() => {
    if (router.isReady) setState(getInitialState)
  }, [router.isReady])

  const toggle = useCallback(
    (newState: State) => {
      setState(newState)
      const query = { ...router.query, [name]: newState }
      router.replace({ query }, undefined, {
        scroll: false,
        shallow: true,
      })
    },
    [name, router]
  )

  return [state, toggle] as const
}
