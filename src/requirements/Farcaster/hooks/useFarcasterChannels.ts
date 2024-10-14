import {
  GetFarcasterChannelResponse,
  SearchFarcasterChannelsResponse,
} from "@app/api/farcaster/types"
import { SWRResponse, useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"

const useFarcasterChannels = (search?: string): SWRResponse<SelectOption[]> => {
  const { mutate } = useSWRConfig()

  const swrResponse = useSWRImmutable<SearchFarcasterChannelsResponse>(
    search ? `/api/farcaster/channels/search?q=${search}` : null,
    {
      onSuccess: (channels) => {
        channels.forEach((channel) => {
          mutate(`/api/farcaster/channels/${channel.id}`, channel, {
            revalidate: false,
          })
        })
      },
    }
  )

  return {
    ...swrResponse,
    data: swrResponse.data?.map(farcasterChannelToSelectOption) ?? [],
    mutate: undefined as never,
  }
}

const useFarcasterChannel = (id?: string): SWRResponse<SelectOption> => {
  const swrResponse = useSWRImmutable<GetFarcasterChannelResponse>(
    id ? `/api/farcaster/channels/${id}` : null
  )

  return {
    ...swrResponse,
    data: swrResponse.data
      ? farcasterChannelToSelectOption(swrResponse.data)
      : undefined,
    mutate: undefined as never,
  }
}

const farcasterChannelToSelectOption = (channel: GetFarcasterChannelResponse) => ({
  label: channel.name ?? "Unknown channel",
  value: channel.id,
  img: channel.image_url,
})

export { useFarcasterChannels, useFarcasterChannel }
