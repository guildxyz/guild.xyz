import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react"
import useScrollEffect from "./useScrollEffect"

interface CommonProps {
  batchSize: number
  disableRendering: boolean
  setElementCount: Dispatch<SetStateAction<number>>
}

interface ScrollTargetDefined extends CommonProps {
  scrollTarget: MutableRefObject<HTMLElement | null>
}

export function useScrollBatchedRendering(props: CommonProps): MutableRefObject<null>
export function useScrollBatchedRendering(props: ScrollTargetDefined): void

export function useScrollBatchedRendering({
  batchSize,
  scrollTarget,
  disableRendering,
  setElementCount,
}: ScrollTargetDefined) {
  const localScrollTarget = useRef(null)

  useScrollEffect(() => {
    const target = scrollTarget === undefined ? localScrollTarget : scrollTarget
    if (
      !target.current ||
      target.current.getBoundingClientRect().bottom > window.innerHeight ||
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
