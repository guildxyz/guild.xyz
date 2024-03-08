import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import Button from "components/common/Button"
import useToast from "hooks/useToast"
import platforms from "platforms/platforms"
import { PlatformName, PlatformType } from "types"

import { HStack, Icon, Tooltip, useDisclosure } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import useMembership from "components/explorer/hooks/useMembership"
import useSubmit from "hooks/useSubmit"
import { OAuthResultParams } from "pages/oauth-result"
import { Question } from "phosphor-react"
import { memo } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import useDisconnect from "../../hooks/useDisconnect"
import DisconnectAccountButton from "./components/DisconnectAccountButton"
import SocialAccountUI from "./components/SocialAccountUI"

type Props = {
  type: PlatformName
}

const SocialAccount = memo(({ type }: Props): JSX.Element => {
  const { platformUsers } = useUser()
  const { membership } = useMembership()
  const platformUser = platformUsers?.find(
    (platform) => platform.platformName.toString() === type
  )

  const isConnected = !!platformUser

  const isReconnect =
    !!membership &&
    membership?.roles?.some(({ requirements }) =>
      requirements?.some(
        ({ errorType, subType }) =>
          errorType === "PLATFORM_CONNECT_INVALID" && subType?.toUpperCase() === type
      )
    )

  return (
    <SocialAccountUI
      type={type}
      avatarUrl={platformUser?.platformUserData?.avatar}
      username={platformUser?.platformUserData?.username}
      isConnected={isConnected}
    >
      {type === "TWITTER_V1" ? <TwitterV1Tooltip /> : null}
      {!isConnected ? (
        <ConnectPlatformButton type={type} />
      ) : (
        <HStack spacing="1">
          {isReconnect && <ConnectPlatformButton type={type} isReconnect />}
          <DisconnectPlatformButton type={type} />
        </HStack>
      )}
    </SocialAccountUI>
  )
})

export const TwitterV1Tooltip = () => (
  <Tooltip
    hasArrow
    placement="top"
    label="Some of our X requirements can only be checked if your X account is connected this way as well"
  >
    <Icon color="gray" as={Question} />
  </Tooltip>
)

function getOAuthURL(platformName: string, authToken: string) {
  const url = new URL(`../v2/oauth/${platformName}`, process.env.NEXT_PUBLIC_API)
  url.searchParams.set("path", window.location.pathname)
  url.searchParams.set("token", authToken)
  return url.href
}

const ConnectPlatformButton = ({ type, isReconnect = false }) => {
  const toast = useToast()
  const { triggerMembershipUpdate } = useMembershipUpdate()
  const fetcherWithSign = useFetcherWithSign()
  const { id, mutate: mutateUser } = useUser()

  const onSuccess = () => {
    toast({
      title: `Account successfully connected`,
      status: "success",
    })
    triggerMembershipUpdate()
  }

  const { isLoading, response } = useConnectPlatform(
    type as PlatformName,
    onSuccess,
    isReconnect
  )

  const asd = useSubmit(
    async () => {
      const channel = new BroadcastChannel(`guild-${type}`)
      const messageListener = new Promise<void>((resolve, reject) => {
        channel.onmessage = (event) => {
          if (
            event.isTrusted &&
            event.origin === window.origin &&
            event.data?.type !== "oauth-confirmation"
          ) {
            channel.postMessage({ type: "oauth-confirmation" })
            const result: OAuthResultParams = event.data

            if (result.status === "success") {
              fetcherWithSign([
                `/v2/users/${id}/platform-users/${PlatformType[type]}`,
                { method: "GET" },
              ])
                .then((newPlatformUser) =>
                  mutateUser(
                    (prev) => ({
                      ...prev,
                      platformUsers: [
                        ...(prev?.platformUsers ?? []).filter(
                          ({ platformId }) =>
                            platformId !== newPlatformUser.platformId
                        ),
                        { ...newPlatformUser, platformName: type },
                      ],
                    }),
                    { revalidate: false }
                  )
                )
                .then(() => resolve())
                .catch(() => reject("Failed to get new platform connection"))

              return
            } else {
              reject(new Error(result.message))
            }
          }
        }
      })

      const { token } = await fetcherWithSign([
        `/v2/oauth/${type}/token`,
        { method: "GET" },
      ])

      const url = getOAuthURL(type, token)

      if (type === "TELEGRAM") {
        window.location.href = url
      } else {
        window.open(url, "_blank", "popup,width=600,height=750,scrollbars")
      }

      await messageListener
    },
    {
      onSuccess,
      onError: (error) => {
        toast({
          status: "error",
          description: error.message ?? `Failed to connect ${type}`,
        })
      },
    }
  )

  return (
    <Button
      onClick={asd.onSubmit}
      isLoading={isLoading}
      isDisabled={response}
      colorScheme={isReconnect ? "orange" : platforms[type].colorScheme}
      variant={isReconnect ? "subtle" : "solid"}
      size="sm"
    >
      {isReconnect ? "Reconnect" : "Connect"}
    </Button>
  )
}

const DisconnectPlatformButton = ({ type }: { type: PlatformName }) => {
  const disclosure = useDisclosure()

  const { onSubmit, isLoading, signLoadingText } = useDisconnect(disclosure.onClose)
  const onConfirm = () => onSubmit({ platformName: type })
  const loadingText = signLoadingText ?? "Removing"

  return (
    <DisconnectAccountButton
      {...{
        disclosure,
        isLoading,
        loadingText,
        onConfirm,
        name: platforms[type].name,
      }}
    />
  )
}

export default SocialAccount
