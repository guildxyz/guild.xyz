import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import { WarningCircle } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { ReactNode } from "react"
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
    <Popover trigger="hover" openDelay={0}>
      <PopoverTrigger>
        <Icon
          as={WarningCircle}
          color="orange.300"
          weight="fill"
          boxSize={6}
          tabIndex={0}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            {`Google limits documentum sharing to 600 users, and there're already ${
              roleMemberCount
            }
            eligible members, so you might not get access to this reward.`}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default GoogleCardWarning
