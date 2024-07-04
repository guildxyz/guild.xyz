import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import Button from "components/common/Button"
import useToast from "hooks/useToast"
import { PlatformName } from "types"

import { HStack, useDisclosure } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import useMembership from "components/explorer/hooks/useMembership"
import rewards from "rewards"
import { memo } from "react"
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

const ConnectPlatformButton = ({ type, isReconnect = false }) => {
  const toast = useToast()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const onSuccess = () => {
    toast({
      title: `Account successfully connected`,
      status: "success",
    })
    triggerMembershipUpdate()
  }

  const { isLoading, response, onConnect } = useConnectPlatform(
    type as PlatformName,
    onSuccess,
    isReconnect
  )

  return (
    <Button
      onClick={onConnect}
      isLoading={isLoading}
      isDisabled={response}
      colorScheme={isReconnect ? "orange" : rewards[type].colorScheme}
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
        name: rewards[type].name,
      }}
    />
  )
}

export default SocialAccount
