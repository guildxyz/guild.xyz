import { useEffect, useState } from "react"
import useSnapshots from "./useSnapshots"

const useStrategyParamsArray = (
  strategyName: string
): Array<{ name: string; defaultValue: string | number }> => {
  const { strategies } = useSnapshots()
  const [params, setParams] = useState([])

  useEffect(() => {
    const rawParams = strategies?.find(
      (strategy) => strategy.name === strategyName
    )?.params

    const paramsArray = []
    if (rawParams) {
      for (const [name, defaultValue] of Object.entries(rawParams)) {
        paramsArray.push({ name, defaultValue })
      }
    }

    setParams(paramsArray)
  }, [strategyName])

  return params
}

export default useStrategyParamsArray
