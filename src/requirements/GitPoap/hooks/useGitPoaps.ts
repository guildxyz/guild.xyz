import useSWRImmutable from "swr/immutable"
import { GitPoap } from "types"
import fetcher from "utils/fetcher"

const fetchGitPoaps = (_: string) =>
  fetcher("https://public-api.gitpoap.io/v1/gitpoaps/events")
    .then((res) => res.gitPoapEvents)
    .catch(() => [])

const useGitPoaps = (): { gitPoaps: Array<GitPoap>; isLoading: boolean } => {
  const { isLoading, data } = useSWRImmutable("gitpoaps", fetchGitPoaps)

  return { isLoading, gitPoaps: data }
}

export default useGitPoaps
