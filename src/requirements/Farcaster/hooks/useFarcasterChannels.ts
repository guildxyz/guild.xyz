import { useFarcasterAPI } from "@/hooks/useFarcasterAPI"
import { NEYNAR_BASE_URL } from "@/hooks/useFarcasterAPI/constants"
import type { NeynarAPIClient } from "@neynar/nodejs-sdk"
import { SWRResponse, useSWRConfig } from "swr"
import { SelectOption } from "types"

const useFarcasterChannels = (search?: string): SWRResponse<SelectOption[]> => {
  const { mutate } = useSWRConfig()

  const swrResponse = useFarcasterAPI<
    Awaited<ReturnType<NeynarAPIClient["searchChannels"]>>
  >(search ? `/channel/search?q=${search}` : null, {
    onSuccess: (data) => {
      data.channels.forEach((channel) => {
        mutate(
          `${NEYNAR_BASE_URL}/channel?id=${channel.id}`,
          { channel },
          { revalidate: false }
        )
      })
    },
  })

  return {
    ...swrResponse,
    data: swrResponse.data?.channels?.map(farcasterChannelToSelectOption) ?? [],
    mutate: undefined as never,
  }
}

const useFarcasterChannel = (id?: string): SWRResponse<SelectOption> => {
  const swrResponse = useFarcasterAPI<
    Awaited<ReturnType<NeynarAPIClient["lookupChannel"]>>
  >(id ? `/channel?id=${id}` : null)

  const channel = swrResponse.data?.channel

  return {
    ...swrResponse,
    data: channel ? farcasterChannelToSelectOption(channel) : undefined,
    mutate: undefined as never,
  }
}

const farcasterChannelToSelectOption = (channel: Record<string, any>) => ({
  label: channel.name,
  value: channel.id,
  img: channel.image_url,
})

export { useFarcasterChannels, useFarcasterChannel }
