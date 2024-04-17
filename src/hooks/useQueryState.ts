import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

export const useQueryState = <State extends string>(
  name: string,
  defaultState: State
) => {
  const router = useRouter()

  const getInitialState = useCallback(() => {
    const queries = router.query[name]
    const query = Array.isArray(queries) ? queries[0] : queries
    return query ? (query as State) : defaultState
  }, [router.query, name, defaultState])

  const [state, setState] = useState(getInitialState)

  useEffect(() => {
    if (router.isReady) setState(getInitialState)
  }, [router.isReady, getInitialState])

  const toggle = useCallback(
    (newState: State) => {
      setState(newState)
      router.query[name] = newState
      router.replace({ query: router.query }, undefined, {
        scroll: false,
      })
    },
    [name, router]
  )

  return [state, toggle] as const
}
