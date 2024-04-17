import { SWRResponse, useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"

const BASE_URL =
  "https://api.neynar.com/v2/farcaster/channel/search?api_key=NEYNAR_API_DOCS&q="
const SINGLE_CHANNEL_BASE_URL =
  "https://api.neynar.com/v2/farcaster/channel?api_key=NEYNAR_API_DOCS&id="

const useFarcasterChannels = (search?: string): SWRResponse<SelectOption[]> => {
  const { mutate } = useSWRConfig()
  const swrResponse = useSWRImmutable(search ? `${BASE_URL}${search}` : null, {
    onSuccess: (data, _key, _config) => {
      data.channels?.forEach((channel) => {
        mutate(
          `${SINGLE_CHANNEL_BASE_URL}${channel.id}`,
          { channel },
          {
            revalidate: false,
          }
        )
      })
    },
  })

  return {
    ...swrResponse,
    data: swrResponse.data?.channels?.map(farcasterChannelToSelectOption) ?? [],
  }
}

const useFarcasterChannel = (id?: string): SWRResponse<SelectOption> => {
  const swrResponse = useSWRImmutable(id ? `${SINGLE_CHANNEL_BASE_URL}${id}` : null)

  const channel = swrResponse.data?.channel

  return {
    ...swrResponse,
    data: channel ? farcasterChannelToSelectOption(channel) : undefined,
  }
}

const farcasterChannelToSelectOption = (channel: Record<string, any>) => ({
  label: channel.name,
  value: channel.id,
  img: channel.image_url,
})

export default useFarcasterChannels
export { useFarcasterChannel }
