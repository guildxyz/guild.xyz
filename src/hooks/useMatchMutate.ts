import { MutatorOptions, useSWRConfig } from "swr"

// Source: https://swr.vercel.app/docs/advanced/cache#mutate-multiple-keys-from-regex
const useMatchMutate = () => {
  const { cache, mutate } = useSWRConfig()

  return <Data>(
    matcher: RegExp,
    mutator?: (prevData: Data) => Data,
    options?: MutatorOptions<Data>
  ) => {
    if (!(cache instanceof Map)) {
      throw new Error("matchMutate requires the cache provider to be a Map instance")
    }

    const keys = []

    for (const key of cache.keys()) {
      if (matcher.test(key)) {
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        keys.push(key)
      }
    }

    const mutations = keys.map((key) => mutate<Data>(key, mutator, options))
    return Promise.all(mutations)
  }
}

export default useMatchMutate
