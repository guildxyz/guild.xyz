import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import useEditRolePlatform from "components/[guild]/AccessHub/hooks/useEditRolePlatform"
import EditRolePlatformCapacityTimeModal from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTimeModal"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { Clock, PencilSimple } from "phosphor-react"
import { PlatformName, PlatformType } from "types"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import EditUniqueTextModal from "./EditUniqueTextModal"

type Props = {
  platformGuildId: string
}

const UniqueTextCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms, roles } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )
  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform?.id)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    isOpen: isCapacityTimeOpen,
    onOpen: onCapacityTimeOpen,
    onClose: onCapacityTimeClose,
  } = useDisclosure()

  const toast = useToast()

  const { onSubmit, isLoading } = useEditRolePlatform({
    rolePlatformId: rolePlatform?.id,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated reward",
      })
      onCapacityTimeClose()
    },
  })

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit unique secret
        </MenuItem>
        {rolePlatform && (
          <MenuItem icon={<Clock />} onClick={onCapacityTimeOpen}>
            Edit availibility
          </MenuItem>
        )}
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      <EditUniqueTextModal
        isOpen={isOpen}
        onClose={onClose}
        guildPlatformId={guildPlatform?.id}
        platformGuildData={guildPlatform?.platformGuildData}
      />

      <EditRolePlatformCapacityTimeModal
        isOpen={isCapacityTimeOpen}
        onClose={onCapacityTimeClose}
        platformType={PlatformType[guildPlatform.platformId] as PlatformName}
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
export default UniqueTextCardMenu
