import { Fetcher, Key } from "swr"
import useSWRImmtable from "swr/immutable"

const useSWRSubmit = (key: Key, fetcher: Fetcher<any>) => {
  const { data, mutate, isValidating, error } = useSWRImmtable(key, fetcher, {
    revalidateOnMount: false,
    shouldRetryOnError: false,
  })

  const removeError = () => mutate((_) => _, false)

  const onSubmit = (onSuccess?: Function, onError?: Function) => async () => {
    removeError()
    if (!data) {
      const newData = await mutate()
      if (newData) onSuccess?.()
      else onError?.()
    } else {
      onSuccess()
    }
  }

  return {
    data,
    submit: async () => await mutate(),
    onSubmit,
    isLoading: isValidating,
    // explicit undefined instead of just "&& error" so it doesn't change to false
    error: !data && !isValidating ? error : undefined,
    removeError,
  }
}

export default useSWRSubmit
