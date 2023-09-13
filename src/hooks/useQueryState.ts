import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import tryToParseJSON from "utils/tryToParseJSON"

export const useQueryState = <State extends string>(
  name: string,
  defaultState: State
) => {
  const router = useRouter()

  const getInitialState = () => {
    const queries = router.query[name]
    const query = Array.isArray(queries) ? queries[0] : queries
    return query ? tryToParseJSON(query) || query : defaultState
  }

  const [state, setState] = useState(getInitialState)

  useEffect(() => {
    if (router.isReady) setState(getInitialState)
  }, [router.isReady])

  const handleSetState = useCallback(
    (value: State | ((old: State) => State)) => {
      const newState =
        value instanceof Function
          ? value(tryToParseJSON(router.query[name]) || router.query[name])
          : value

      setState(newState)
      router.query[name] =
        typeof newState === "object" ? JSON.stringify(newState) : newState
      router.replace({ query: router.query }, undefined, {
        scroll: false,
      })
    },
    [name, router]
  )

  return [state, handleSetState] as const
}
