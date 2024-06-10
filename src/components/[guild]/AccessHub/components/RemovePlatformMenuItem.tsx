import { MenuItem, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import useRemoveGuildPlatform from "components/[guild]/AccessHub/hooks/useRemoveGuildPlatform"
import { AlreadyGrantedAccessesWillRemainInfo } from "components/[guild]/RolePlatforms/components/RemovePlatformButton/RemovePlatformButton"
import useGuild from "components/[guild]/hooks/useGuild"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import { TrashSimple } from "phosphor-react"
import rewards from "platforms/rewards"
import { PlatformType } from "types"

type Props = {
  platformGuildId: string
}

const RemovePlatformMenuItem = ({ platformGuildId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const color = useColorModeValue("red.600", "red.300")
  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )
  const { onSubmit, isLoading } = useRemoveGuildPlatform(guildPlatform?.id)
  if (guildPlatform === undefined)
    throw new Error(`Unmatched guild platform ID ${platformGuildId}`)
  const { isPlatform } = rewards[PlatformType[guildPlatform.platformId]] ?? {}

  return (
    <>
      <MenuItem icon={<TrashSimple />} onClick={onOpen} color={color}>
        Remove reward...
      </MenuItem>

      <ConfirmationAlert
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSubmit}
        title="Remove reward"
        description={
          <>
            Are you sure you want to remove this reward?
            {isPlatform && <AlreadyGrantedAccessesWillRemainInfo />}
          </>
        }
        confirmationText="Remove"
      />
    </>
  )
}

export default RemovePlatformMenuItem
