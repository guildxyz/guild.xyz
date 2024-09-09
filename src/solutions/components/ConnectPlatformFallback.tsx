import { PLATFORM_COLORS } from "@/components/Account/components/AccountModal/components/SocialAccount"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useUser from "components/[guild]/hooks/useUser"
import rewards from "rewards"
import { PlatformName, Rest } from "types"

type Props = {
  platform: PlatformName
} & Rest

export const ConnectPlatformFallback = ({ platform, children, ...rest }: Props) => {
  const reward = rewards[platform]

  const { onConnect, isLoading, loadingText } = useConnectPlatform(
    platform,
    undefined,
    false,
    "creation"
  )

  const user = useUser()
  const isPlatformConnected =
    !reward.isPlatform ||
    user.platformUsers?.some(
      ({ platformName, platformUserData }) =>
        platformName === platform && !platformUserData?.readonly
    )

  if (isPlatformConnected) return children

  return (
    <Card className="flex justify-between gap-4 border p-5 shadow-none max-sm:flex-col sm:items-center">
      <p className="font-semibold">{`Connect ${reward.name} account to show ${reward.gatedEntity}s`}</p>
      <Button
        onClick={onConnect}
        isLoading={isLoading}
        loadingText={loadingText}
        className={PLATFORM_COLORS[platform] ?? ""}
      >
        {reward.icon && <reward.icon />}
        Connect
      </Button>
    </Card>
  )
}
