import type { FormData } from "pages/[community]/admin/community"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useCommunityData from "./useCommunityData"
import useSubmitMachine from "./useSubmitMachine"

const useSubmitPlatformsData = (
  telegramChanged: boolean,
  discordChanged: boolean,
  callback: () => void
) => {
  const { communityData } = useCommunityData()

  const fetchService = (_context: ContextType, { data }: SignEvent<any>) => {
    const promises = []

    if (telegramChanged)
      promises.push(
        fetch(
          `${process.env.NEXT_PUBLIC_API}/community/${communityData?.id}/platform`,
          {
            method: communityData?.communityPlatforms?.some(
              (platform) => platform.name === "TELEGRAM"
            )
              ? "PATCH"
              : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              addressSignedMessage: data.addressSignedMessage,
              platform: "TELEGRAM",
              active: data.isTGEnabled,
            }),
          }
        )
      )

    if (discordChanged)
      promises.push(
        fetch(
          `${process.env.NEXT_PUBLIC_API}/community/${communityData?.id}/platform`,
          {
            method: communityData?.communityPlatforms?.some(
              (platform) => platform.name === "DISCORD"
            )
              ? "PATCH"
              : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              addressSignedMessage: data.addressSignedMessage,
              platform: "DISCORD",
              active: data.isDCEnabled,
              platformId: data.discordServerId,
              inviteChannel: data.inviteChannel,
            }),
          }
        )
      )

    return Promise.all(promises)
  }

  const redirectAction = async () => {
    if (typeof callback === "function") callback()
  }

  return useSubmitMachine<FormData>(
    telegramChanged || discordChanged
      ? "Platform data updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds."
      : null,
    fetchService,
    redirectAction
  )
}

export default useSubmitPlatformsData
