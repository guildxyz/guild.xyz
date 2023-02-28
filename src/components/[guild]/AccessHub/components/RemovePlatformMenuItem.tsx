import { MenuItem, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useRemoveGuildPlatform from "components/[guild]/RolePlatforms/components/PlatformCard/components/useDiscordCardProps/DiscordCardMenu/hooks/useRemoveGuildPlatform"
import { RemovePlatformAlert } from "components/[guild]/RolePlatforms/components/RemovePlatformButton/RemovePlatformButton"
import { TrashSimple } from "phosphor-react"

type Props = {
  platformGuildId: string
}

const RemovePlatformMenuItem = ({ platformGuildId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { onSubmit, isLoading: isRemoveGuildPlatformLoading } =
    useRemoveGuildPlatform(guildPlatform?.id)

  const color = useColorModeValue("red.600", "red.300")

  return (
    <>
      <MenuItem icon={<TrashSimple />} onClick={onOpen} color={color}>
        Remove reward...
      </MenuItem>

      <RemovePlatformAlert
        guildPlatform={guildPlatform}
        keepAccessDescription="Everything on the platform will remain as is for existing members, but accesses by this Guild won’t be managed anymore"
        revokeAccessDescription="Existing members will lose their accesses on the platform granted by this Guild"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isRemoveGuildPlatformLoading}
      />
    </>
  )
}

export default RemovePlatformMenuItem
