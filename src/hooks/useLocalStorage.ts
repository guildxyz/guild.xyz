import { datadogRum } from "@datadog/browser-rum"
import { useRumError } from "@datadog/rum-react-integration"
import { useState } from "react"

const getDataFromLocalstorage = <T>(
  key: string,
  initialValue: T,
  shouldSaveInitial = false
) => {
  if (typeof window === "undefined") return initialValue
  try {
    const item = window.localStorage.getItem(key)
    if (!item) {
      if (shouldSaveInitial)
        window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    }
    return JSON.parse(item)
  } catch (error) {
    datadogRum?.addError("getDataFromLocalstorage error", { error })
    return initialValue
  }
}

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  shouldSaveInitial = false
) => {
  const addDatadogError = useRumError()

  const [storedValue, setStoredValue] = useState<T>(() =>
    getDataFromLocalstorage(key, initialValue, shouldSaveInitial)
  )

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      addDatadogError("Automatic statusUpdate error", { error }, "custom")
    }
  }
  return [storedValue, setValue] as const
}

export default useLocalStorage
