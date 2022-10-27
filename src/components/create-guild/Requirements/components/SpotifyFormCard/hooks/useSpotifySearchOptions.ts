import useUser from "components/[guild]/hooks/useUser"
import useSWR from "swr"

export type SpotifySearchResultItem = {
  id: string
  name: string
  images: Array<{
    url: string
    height: number
    width: number
  }>
  album?: SpotifySearchResultItem
  artists?: Array<{
    id: string
    name: string
  }>
}

export type SearchType =
  | "album"
  | "artist"
  | "playlist"
  | "track"
  | "show"
  | "episode"
  | "audiobook"

type Option = { label: string; value: string; img?: string; details?: string }

const useSpotifySearchOptions = (
  search: string,
  type: SearchType
): {
  isLoading: boolean
  options: Array<Option>
} => {
  const { platformUsers } = useUser()

  const spotifyToken = platformUsers?.find(
    (platformUser) => platformUser.platformName === "SPOTIFY"
  )?.platformUserData?.accessToken

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

  const options = (data?.[`${type}s`]?.items ?? []).map(
    ({ id, images, name, artists, album }: SpotifySearchResultItem) => ({
      value: id,
      label: name,
      img: images?.[0]?.url ?? album?.images?.[0]?.url,
      details: artists?.[0]?.name,
    })
  )

  return {
    isLoading: !data && !error && isValidating,
    options,
  }
}

export default useSpotifySearchOptions
