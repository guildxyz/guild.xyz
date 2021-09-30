import { useEffect, useState } from "react"

const useParamsArray = (
  rawParams: Record<string, string | number>
): Array<{ name: string; value: string | number }> => {
  const [params, setParams] = useState([])

  useEffect(() => {
    const paramsArray = []

    for (const [name, value] of Object.entries(rawParams)) {
      paramsArray.push({ name, value })
    }

    setParams(paramsArray)
  }, [rawParams])

  return params
}

export default useParamsArray
