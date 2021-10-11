import { Fetcher, Key } from "swr"
import useSWRImmtable from "swr/immutable"

const useSWRSubmit = (key: Key, fetcher: Fetcher<any>) => {
  const { data, mutate, isValidating, error } = useSWRImmtable(key, fetcher, {
    revalidateOnMount: false,
    shouldRetryOnError: false,
  })

  const removeError = () => mutate((_) => _, false)

  return {
    data,
    submit: async () => await mutate(),
    isLoading: isValidating,
    // explicit undefined instead of just "&& error" so it doesn't change to false
    error: !data && !isValidating ? error : undefined,
    removeError,
  }
}

export default useSWRSubmit
