import {} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { ReactNode } from "react"
import { CardWarningComponentBase } from "rewards/components/CardWarningComponentBase"
import { CardWarningComponentProps } from "rewards/types"

const GoogleCardWarning = ({
  rolePlatform,
}: CardWarningComponentProps): ReactNode => {
  const { roles } = useGuild()
  const roleMemberCount =
    roles?.find((role) => role.rolePlatforms.some((rp) => rp.id === rolePlatform.id))
      ?.memberCount ?? 0

  if (roleMemberCount <= 600) return null

  return (
    <CardWarningComponentBase>
      {`Google limits documentum sharing to 600 users, and there're already ${
        roleMemberCount
      }
            eligible members, so you might not get access to this reward.`}
    </CardWarningComponentBase>
  )
}

export default GoogleCardWarning
