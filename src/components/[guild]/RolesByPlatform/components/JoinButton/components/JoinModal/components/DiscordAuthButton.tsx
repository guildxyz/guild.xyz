import useUser from "components/[guild]/hooks/useUser"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useDCAuth, { fetcherWithDCAuth } from "../hooks/useDCAuth"
import ConnectPlatform from "./ConnectPlatform"

const DiscordAuthButton = (): JSX.Element => {
  const user = useUser()
  const router = useRouter()

  const discordFromDb = user?.platformUsers?.find(
    (platformUser) => platformUser.platformName === "DISCORD"
  )?.username
  const discordFromQueryParam =
    router.query.platform === "DISCORD" && typeof router.query.hash === "string"

  const { onOpen, authorization, error, isAuthenticating } = useDCAuth("identify")

  const {
    response: dcUsername,
    isLoading: isFetchingUsername,
    onSubmit: fetchUsername,
  } = useSubmit(() =>
    fetcherWithDCAuth(authorization, "https://discord.com/api/users/@me").then(
      (res) => res.username
    )
  )

  const { setValue } = useFormContext()

  useEffect(() => {
    if (discordFromDb) return

    if (discordFromQueryParam)
      setValue("platforms.DISCORD", { hash: router.query.hash as string })

    if (authorization) {
      fetchUsername()
      setValue("platforms.DISCORD", {
        authData: { access_token: authorization?.split(" ")?.[1] },
      })
    }
  }, [discordFromDb, discordFromQueryParam, authorization])

  return (
    <ConnectPlatform
      platform="DISCORD"
      isConnected={
        discordFromDb ||
        (discordFromQueryParam && "...") ||
        (authorization && (dcUsername ?? "..."))
      }
      onClick={onOpen}
      isLoading={isAuthenticating}
      loadingText={isAuthenticating && "Confirm in the pop-up"}
    />
  )
}

export default DiscordAuthButton
