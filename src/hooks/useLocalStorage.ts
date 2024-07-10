import { useState } from "react"
import tryToParseJSON from "utils/tryToParseJSON"

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
    return tryToParseJSON(item) ?? item
  } catch (error) {
    console.error(error)
    return initialValue
  }
}

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  shouldSaveInitial = false
) => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getDataFromLocalstorage(key, initialValue, shouldSaveInitial)
  )

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    if (valueToStore === undefined) {
      window.localStorage.removeItem(key)
    } else {
      const stringToStore =
        typeof valueToStore === "object"
          ? JSON.stringify(valueToStore)
          : (valueToStore as string)
      window.localStorage.setItem(key, stringToStore)
    }
  }
  return [storedValue, setValue] as const
}

export default useLocalStorage
