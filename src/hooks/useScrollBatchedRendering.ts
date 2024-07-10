import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react"
import useScrollEffect from "./useScrollEffect"

interface CommonProps {
  batchSize: number
  disableRendering: boolean
  setElementCount: Dispatch<SetStateAction<number>>
  offsetPixel?: number
}

interface WithScrollTarget extends CommonProps {
  scrollTarget: MutableRefObject<HTMLElement | null>
}

export function useScrollBatchedRendering(props: CommonProps): MutableRefObject<null>
export function useScrollBatchedRendering(props: WithScrollTarget): void

export function useScrollBatchedRendering({
  batchSize,
  scrollTarget,
  disableRendering,
  setElementCount,
  offsetPixel = 0,
}: WithScrollTarget) {
  const localScrollTarget = useRef<HTMLElement | null>(null)

  useScrollEffect(() => {
    const target = scrollTarget === undefined ? localScrollTarget : scrollTarget
    if (
      !target.current ||
      target.current.getBoundingClientRect().bottom - offsetPixel >
        window.innerHeight ||
      disableRendering
    ) {
      return
    }
    setElementCount((prev) => prev + batchSize)
  }, [scrollTarget, disableRendering, batchSize])

  if (scrollTarget === undefined) {
    return localScrollTarget
  }
}
