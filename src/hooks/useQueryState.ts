import { useRouter } from "next/router"
import { useCallback, useState } from "react"

export const useQueryState = <State extends string>(
  name: string,
  defaultState: State
) => {
  const router = useRouter()

  const [state, setState] = useState(() => {
    const queries = router.query[name]
    const query = Array.isArray(queries) ? queries[0] : queries
    return query ? (query as State) : defaultState
  })

  const toggle = useCallback(
    (newState: State) => {
      setState(newState)
      const query = { ...router.query, [name]: newState }
      router.replace({ query }, undefined, {
        scroll: false,
      })
    },
    [name, router]
  )

  return [state, toggle] as const
}
