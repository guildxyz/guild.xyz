import { useSWRConfig } from "swr"

// Source: https://swr.vercel.app/docs/advanced/cache#mutate-multiple-keys-from-regex
const useMatchMutate = () => {
  const { cache, mutate } = useSWRConfig()

  return (matcher: RegExp, ...args: Array<any>) => {
    if (!(cache instanceof Map)) {
      throw new Error("matchMutate requires the cache provider to be a Map instance")
    }

    const keys = []

    for (const key of cache.keys()) {
      if (matcher.test(key)) {
        keys.push(key)
      }
    }

    const mutations = keys.map((key) => mutate(key, ...args))
    return Promise.all(mutations)
  }
}

export default useMatchMutate
