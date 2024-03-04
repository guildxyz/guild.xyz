import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import Button from "components/common/Button"
import useToast from "hooks/useToast"
import platforms from "platforms/platforms"
import { PlatformName, PlatformType } from "types"

import { HStack, Icon, Tooltip, useDisclosure } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import useMembership from "components/explorer/hooks/useMembership"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
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

function toBase64Url(str: string, fromEncoding: BufferEncoding = "utf-8") {
  const base64 = Buffer.from(str, fromEncoding).toString("base64")
  const base64url = base64.replaceAll(/\+/g, "-").replaceAll(/\//g, "_")
  return base64url
}

function getOAuthURL(platformName: string, signature: string, params: any) {
  const url = new URL(`../v2/oauth/${platformName}`, process.env.NEXT_PUBLIC_API)

  url.searchParams.set("sig", toBase64Url(signature, "hex"))
  url.searchParams.set("params", toBase64Url(JSON.stringify(params)))
  url.searchParams.set("path", window.location.pathname)

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

  const asd = useSubmitWithSign(
    async (signedData: SignedValidation) => {
      const { platformName } = JSON.parse(signedData.signedPayload)

      const channel = new BroadcastChannel(`guild-${platformName}`)
      const messageListener = new Promise<void>((resolve, reject) => {
        channel.onmessage = (event) => {
          if (event.isTrusted && event.origin === window.origin) {
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
              reject(result.message)
            }
          }
        }
      })

      const url = getOAuthURL(
        platformName,
        signedData.validation.sig,
        signedData.validation.params
      )

      window.open(
        url.toString(),
        type === "TELEGRAM" ? "_self" : "_blank",
        type === "TELEGRAM" ? "noopener,noreferrer" : undefined
      )

      await messageListener
    },
    { onSuccess, onError: console.error }
  )

  return (
    <Button
      onClick={() => asd.onSubmit({ platformName: type })}
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
