import useSWRImmutable from "swr/immutable"

const useTwitterAvatar = (username: string) => {
  const { data, isValidating, error } = useSWRImmutable(
    `/api/twitter-avatar/${username}`
  )

  return { url: data?.url, isLoading: isValidating, error }
}

export default useTwitterAvatar
