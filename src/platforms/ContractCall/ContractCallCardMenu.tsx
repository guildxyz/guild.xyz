import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import useEditRolePlatform from "components/[guild]/AccessHub/hooks/useEditRolePlatform"
import EditRolePlatformCapacityTimeModal from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTimeModal"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { Clock } from "phosphor-react"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"

type Props = {
  platformGuildId: string
}

const ContractCallCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms, roles } = useGuild()
  const guildPlatform = guildPlatforms.find(
    (gp) => gp.platformGuildId === platformGuildId
  )
  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform?.id)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()

  const { onSubmit, isLoading } = useEditRolePlatform({
    rolePlatformId: rolePlatform?.id,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated reward",
      })
      onClose()
    },
  })

  return (
    <>
      <PlatformCardMenu>
        {rolePlatform && (
          <MenuItem icon={<Clock />} onClick={onOpen}>
            Edit availibility
          </MenuItem>
        )}
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      <EditRolePlatformCapacityTimeModal
        isOpen={isOpen}
        onClose={onClose}
        platformType="CONTRACT_CALL"
        defaultValues={{
          capacity: rolePlatform?.capacity,
          startTime: rolePlatform?.startTime,
          endTime: rolePlatform?.endTime,
        }}
        isLoading={isLoading}
        onDone={onSubmit}
      />
    </>
  )
}

export default ContractCallCardMenu
