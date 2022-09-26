import { Alert, AlertIcon } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { PlatformType, RolePlatform } from "types"

type Props = {
  memberCount: number
  platforms: RolePlatform[]
}

const GoogleLimitAlert = ({ memberCount, platforms }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const googlePlatforms = guildPlatforms
    ?.filter((p) => p.platformId === PlatformType.GOOGLE)
    ?.map((p) => p.id)

  const hasGooglePlatform = platforms?.find((p) =>
    googlePlatforms?.includes(p.guildPlatformId)
  )

  if (!hasGooglePlatform) return null

  return (
    <Alert mt={6} status="warning">
      <AlertIcon />
      {`Google limits documentum sharing to 600 users, and the role already has ${memberCount}  members, so you might not get access to this reward.`}
    </Alert>
  )
}

export default GoogleLimitAlert
