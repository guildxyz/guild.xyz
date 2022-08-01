import useSWRImmutable from "swr/immutable"

const useTwitterAvatar = (username: string) => {
  const { data, error, isValidating } = useSWRImmutable(
    username?.length > 0 ? `/api/twitter-avatar/${username}` : null
  )

  return {
    url: data?.url ?? (error && "/default_twitter_icon.png"),
    isLoading: !error && !data && isValidating,
  }
}

export default useTwitterAvatar
