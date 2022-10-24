import useUser from "components/[guild]/hooks/useUser"
import useSWR from "swr"

type ResultItem = {
  id: string
  name: string
  images: Array<{
    url: string
    height: number
    width: number
  }>
}

type SpotifySearchResult = Record<string, { items: ResultItem[] }>

export type SearchType =
  | "album"
  | "artist"
  | "playlist"
  | "track"
  | "show"
  | "episode"
  | "audiobook"

const useSpotifySearch = (
  search: string,
  type: SearchType
): {
  isLoading: boolean
  data: SpotifySearchResult
} => {
  const { platformUsers } = useUser()

  const spotifyToken =
    platformUsers?.find((platformUser) => platformUser.platformName === "SPOTIFY")
      ?.platformUserData?.accessToken || (window as any).token
  // TODO: window.token just for debugging

  const shouldFetch = typeof search === "string" && search.length > 0

  const { isValidating, data, error } = useSWR(
    shouldFetch
      ? `/api/spotify-search?search=${encodeURIComponent(
          search
        )}&type=${encodeURIComponent(type)}&token=${encodeURIComponent(
          spotifyToken
        )}`
      : null
  )

  return {
    isLoading: !data && !error && isValidating,
    data,
  }
}

export default useSpotifySearch
