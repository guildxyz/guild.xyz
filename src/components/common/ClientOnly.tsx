import { PropsWithChildren, useEffect, useState } from "react"

const ClientOnly = ({ children }: PropsWithChildren<unknown>) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  return children
}
export default ClientOnly
