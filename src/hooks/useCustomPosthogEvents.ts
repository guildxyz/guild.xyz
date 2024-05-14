import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { PlatformType } from "types"

export default function useCustomPosthogEvents() {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild() ?? {}
  const { id } = useUser() ?? {}

  return {
    rewardCreated(platformId: number, guild?: string) {
      captureEvent("reward created", {
        platformName: PlatformType[platformId],
        guild: guild ?? urlName,
        userId: id,
      })
    },

    rewardGranted(platformId: number) {
      captureEvent("reward granted", {
        platformName: PlatformType[platformId],
        guild: urlName,
        userId: id,
      })
    },

    rewardClaimed(platformId: number) {
      captureEvent("reward claimed", {
        platformName: PlatformType[platformId],
        guild: urlName,
        userId: id,
      })
    },
  } as const
}
