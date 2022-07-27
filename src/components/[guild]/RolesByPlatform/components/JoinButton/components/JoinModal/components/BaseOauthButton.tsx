import ModalButton from "components/common/ModalButton"
import useUser from "components/[guild]/hooks/useUser"
import { useRouter } from "next/router"
import {
  Check,
  DiscordLogo,
  GithubLogo,
  TelegramLogo,
  TwitterLogo,
} from "phosphor-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { PlatformName } from "types"
import { platformAuthHooks } from "../hooks/useOAuthWithCallback"

type Props = {
  connectedText: string
  connectText: string
  platform: PlatformName
}

const platformLogos: Record<Exclude<PlatformName, "">, JSX.Element> = {
  TWITTER: <TwitterLogo />,
  GITHUB: <GithubLogo />,
  DISCORD: <DiscordLogo />,
  TELEGRAM: <TelegramLogo />,
}

const BaseOAuthButton = ({
  connectedText,
  connectText,
  platform,
}: Props): JSX.Element => {
  const user = useUser()
  const router = useRouter()

  const platformFromDb = user?.platformUsers?.some(
    (platformUser) => platformUser.platformName === platform
  )
  const platformFromQueryParam =
    router.query.platform === platform && typeof router.query.hash === "string"

  const { onOpen, authData, error, isAuthenticating } = platformAuthHooks[platform]()

  // const connect = useSubmitWithSign(({ data, validation }) =>
  //   fetcher("/user/connect", {
  //     method: "POST",
  //     body: { payload: data, ...validation },
  //   })
  // )

  // useEffect(() => {
  //   if (authData && !platformFromDb) {
  //     connect.onSubmit({ platformName: platform, authData })
  //   }
  // }, [platformFromDb, authData])

  const { setValue } = useFormContext()

  useEffect(() => {
    if (platformFromDb) return

    if (platformFromQueryParam)
      setValue(`platforms.${platform}`, { hash: router.query.hash as string })

    if (authData) setValue(`platforms.${platform}`, { authData })
  }, [platformFromDb, platformFromQueryParam, authData])

  if (platformFromDb || platformFromQueryParam || authData)
    return (
      <ModalButton
        as="div"
        colorScheme="gray"
        variant="solidStatic"
        rightIcon={platformLogos[platform]}
        leftIcon={<Check />}
        justifyContent="space-between"
        px="4"
      >
        {connectedText}
      </ModalButton>
    )

  return (
    <ModalButton
      onClick={onOpen}
      colorScheme={platform}
      isLoading={isAuthenticating}
      loadingText={isAuthenticating && "Confirm in the pop-up"}
    >
      {connectText}
    </ModalButton>
  )
}

export default BaseOAuthButton
