import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { PlatformType, PoapEventDetails } from "types"

const usePoapEventDetails = (
  poapIdentifier?: number
): {
  poapEventDetails: PoapEventDetails
  isPoapEventDetailsLoading: boolean
  mutatePoapEventDetails: KeyedMutator<any>
} => {
  const { guildPlatforms, id: guildId } = useGuild()
  const { poapData } = useCreatePoapContext()

  const hasDiscordGuildPlatform = guildPlatforms?.some(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const shouldFetch =
    hasDiscordGuildPlatform &&
    (typeof poapData?.id === "number" || typeof poapIdentifier === "number")

  const { data, isValidating, mutate } = useSWRImmutable(
    shouldFetch
      ? `/v2/guilds/${guildId}/poaps/${poapData?.id ?? poapIdentifier}/event-details`
      : null
  )

  return {
    poapEventDetails: data,
    isPoapEventDetailsLoading: isValidating,
    mutatePoapEventDetails: mutate,
  }
}

export default usePoapEventDetails
