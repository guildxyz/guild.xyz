import { Dispatch, MutableRefObject, SetStateAction } from "react"
import useScrollEffect from "./useScrollEffect"

export function useScrollBatchedRendering(
  batchSize: number,
  scrollTarget: MutableRefObject<HTMLElement | null>,
  disableRendering: boolean,
  setElementCount: Dispatch<SetStateAction<number>>
) {
  useScrollEffect(() => {
    if (
      !scrollTarget.current ||
      scrollTarget.current.getBoundingClientRect().bottom > window.innerHeight ||
      disableRendering
    )
      return
    setElementCount((prev) => prev + batchSize)
  }, [scrollTarget, disableRendering, batchSize])
}
