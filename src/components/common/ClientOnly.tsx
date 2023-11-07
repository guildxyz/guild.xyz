import { PropsWithChildren, useEffect, useState } from "react"

/**
 * We use this component as a workaround for wagmi's hydration issues, v2 will solve
 * it and we'll able to remove this from everywhere
 * (https://twitter.com/_jxom/status/1714740525142806610)
 */
const ClientOnly = ({ children }: PropsWithChildren<unknown>) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  return children
}
export default ClientOnly
