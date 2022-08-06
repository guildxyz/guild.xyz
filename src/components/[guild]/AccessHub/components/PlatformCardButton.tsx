import { Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useToast from "hooks/useToast"
import { ArrowSquareOut } from "phosphor-react"
import platforms from "platforms"
import { Platform, PlatformName, PlatformType } from "types"

type Props = {
  platform: Platform
}

const PlatformCardButton = ({ platform }: Props) => {
  const { platformUsers } = useUser()
  const platformName: PlatformName = PlatformType[
    platform.platformId
  ] as PlatformName

  const toast = useToast()
  const onSuccess = () =>
    toast({
      title: `Successfully connected ${platforms[platformName].name}`,
      description: `You can now go to ${platforms[platformName].name} and enjoy your access(es)`,
      status: "success",
    })

  const { onConnect, isLoading, loadingText, response } = useConnectPlatform(
    platformName,
    onSuccess
  )

  const platformFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === platformName
  )

  const buttonProps = {
    mt: "auto",
    h: 10,
    colorScheme: platforms[platformName].colorScheme as any,
  }

  if (!platformFromDb && !response)
    return (
      <Button
        {...buttonProps}
        onClick={onConnect}
        isLoading={isLoading}
        loadingText={loadingText}
        leftIcon={<Icon as={platforms[platformName].icon} />}
      >
        Connect to claim access
      </Button>
    )

  if (platform.invite)
    return (
      <LinkButton
        {...buttonProps}
        href={platform.invite}
        rightIcon={<ArrowSquareOut />}
      >
        {`Go to ${platforms[platformName].gatedEntity}`}
      </LinkButton>
    )

  return (
    <Button {...buttonProps} isDisabled>
      Couldn't fetch link
    </Button>
  )
}

export default PlatformCardButton
