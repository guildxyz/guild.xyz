import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
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
        ...(platformId === PlatformType.CONTRACT_CALL
          ? {
              $set: {
                createdNFT: true,
              },
            }
          : {}),
      })
    },

    rewardClaimed(platformId: number) {
      if (platformId === PlatformType.CONTRACT_CALL) {
        captureEvent("reward claimed", {
          platformName: PlatformType[platformId],
          guild: urlName,
          userId: id,
          ...(platformId === PlatformType.CONTRACT_CALL
            ? {
                $set: {
                  mintedReward: true,
                  mintedNFT: true,
                },
              }
            : {}),
        })
      }
    },
  } as const
}
