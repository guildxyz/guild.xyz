import { usePostHogContext } from "components/_app/PostHogProvider"
import { PlatformType } from "types"

export default function useCustomPosthogEvents() {
  const { captureEvent } = usePostHogContext()

  return {
    rewardCreated(platformId: number, guild: string) {
      captureEvent("reward created", {
        platformName: PlatformType[platformId],
        guild,
      })
    },
  } as const
}
