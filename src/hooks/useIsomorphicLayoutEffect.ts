import { useEffect, useLayoutEffect } from "react"

// Use "useEffect" when rendering on the server, so we don't get warnings
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
