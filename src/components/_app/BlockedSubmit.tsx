import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react"
import { UseFormHandleSubmit } from "react-hook-form"

const BlockedSubmit = createContext({ promises: {}, setPromises: null })

const BlockedSubmitProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [promises, setPromises] = useState<Record<string, Promise<any>>>({})

  return (
    <BlockedSubmit.Provider value={{ promises, setPromises }}>
      {children}
    </BlockedSubmit.Provider>
  )
}

const useBlockedSubmit = <D,>(
  keyOrKeys: string | string[],
  handleSubmit?: UseFormHandleSubmit<D>
) => {
  const keys = useMemo(
    () => (Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys]),
    [keyOrKeys]
  )
  const { promises, setPromises } = useContext(BlockedSubmit)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isSubmitBlocked = keys.some((key) => !!promises[key])

  const removePromise = (key: string) => () => {
    setPromises((prev) => {
      const newPromises = { ...prev }
      delete newPromises[key]
      return newPromises
    })
  }

  const setPromise = (promise) =>
    setPromises((prev) => ({
      ...prev,
      ...Object.fromEntries(
        keys.map((key) => [key, promise.finally(removePromise(key))])
      ),
    }))

  const blockedHandleSubmit = useMemo(
    () =>
      !handleSubmit
        ? null
        : (onValid: (data) => void, onInValid?: (data) => void) => (event) => {
            // handleSubmit just for validation here, so we don't go in "uploading images" state, and focus invalid fields after the loading
            handleSubmit(() => {
              setIsLoading(true)
              if (isSubmitBlocked) {
                Promise.all(keys.map((key) => promises[key]))
                  .catch(() => setIsLoading(false))
                  .then(() =>
                    handleSubmit((data) => {
                      onValid?.(data)
                      setIsLoading(false)
                    })(event)
                  )
              } else {
                handleSubmit((data) => {
                  onValid?.(data)
                  setIsLoading(false)
                })(event)
              }
            }, onInValid)(event)
          },
    [handleSubmit, isSubmitBlocked, keys, promises]
  )

  return {
    setPromise,
    handleSubmit: blockedHandleSubmit,
    isSubmitBlocked, // Promise is running
    isLoading, // True after user interaction
  }
}

export { BlockedSubmitProvider, useBlockedSubmit }
