import { useEffect, useRef } from "react"
import useBlockNumber from "./useBlockNumber"

const useKeepSWRDataLiveAsBlocksArrive = <SWRDataType>(
  mutate: () => Promise<SWRDataType>
): void => {
  // because we don't care about the referential identity of mutate, just bind it to a ref
  const mutateRef = useRef(mutate)

  useEffect(() => {
    mutateRef.current = mutate
  })

  // then, whenever a new block arrives, trigger a mutation
  const blockNumber = useBlockNumber()

  useEffect(() => {
    mutateRef.current()
  }, [blockNumber])
}

export default useKeepSWRDataLiveAsBlocksArrive
