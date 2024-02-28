import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import { truncate } from "utils/truncate"

const BASE_URL =
  "https://api.neynar.com/v2/farcaster/channel/search?api_key=NEYNAR_API_DOCS&q="

const useFarcasterChannels = (search?: string): SWRResponse<SelectOption[]> => {
  const swrResponse = useSWRImmutable(search ? `${BASE_URL}${search}` : null)

  return {
    ...swrResponse,
    data:
      swrResponse.data?.channels?.slice(0, 5).map((channel) => ({
        label: channel.name,
        value: channel.id,
        details: truncate(channel.description, 20),
        img: channel.image_url,
      })) ?? [],
  }
}

const SINGLE_CHANNEL_BASE_URL =
  "https://api.neynar.com/v2/farcaster/channel?api_key=NEYNAR_API_DOCS&id="

const useFarcasterChannel = (id?: string): SWRResponse<SelectOption> => {
  const swrResponse = useSWRImmutable(id ? `${SINGLE_CHANNEL_BASE_URL}${id}` : null)

  const channel = swrResponse.data?.channel

  return {
    ...swrResponse,
    data: channel
      ? {
          label: channel.name,
          value: channel.id,
          details: channel.description,
          img: channel.image_url,
        }
      : undefined,
  }
}

export default useFarcasterChannels
export { useFarcasterChannel }
