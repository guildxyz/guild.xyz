import { MenuItem, useDisclosure } from "@chakra-ui/react"
import EditRewardAvailabilityModal from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityModal"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { Clock } from "phosphor-react"
import { PlatformName, PlatformType } from "types"
import useEditRolePlatform from "../hooks/useEditRolePlatform"

type Props = {
  platformGuildId: string
}

const EditRewardAvailabilityMenuItem = ({ platformGuildId }: Props) => {
  const { guildPlatforms, roles } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )
  const rolePlatform = roles
    ?.flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform?.id)

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

  if (guildPlatform === undefined)
    throw new Error(`Unmatched guild platform ID ${platformGuildId}`)

  return (
    <>
      <MenuItem icon={<Clock />} onClick={onOpen}>
        Edit availability
      </MenuItem>

      <EditRewardAvailabilityModal
        isOpen={isOpen}
        onClose={onClose}
        platformType={PlatformType[guildPlatform.platformId] as PlatformName}
        claimedCount={rolePlatform?.claimedCount}
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
export default EditRewardAvailabilityMenuItem
