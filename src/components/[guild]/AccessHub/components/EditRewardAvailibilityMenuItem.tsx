import { MenuItem, useDisclosure } from "@chakra-ui/react"
import EditRolePlatformAvailibiltyModal from "components/[guild]/RolePlatforms/components/EditRolePlatformAvailibiltyModal"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { Clock } from "phosphor-react"
import { PlatformName, PlatformType } from "types"
import useEditRolePlatform from "../hooks/useEditRolePlatform"

type Props = {
  platformGuildId: string
}

const EditRewardAvailibilityMenuItem = ({ platformGuildId }: Props) => {
  const { guildPlatforms, roles } = useGuild()

  const guildPlatform = guildPlatforms.find(
    (gp) => gp.platformGuildId === platformGuildId
  )
  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

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
      <MenuItem icon={<Clock />} onClick={onOpen}>
        Edit availibility
      </MenuItem>

      <EditRolePlatformAvailibiltyModal
        isOpen={isOpen}
        onClose={onClose}
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
export default EditRewardAvailibilityMenuItem
