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

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const guildPlatform = guildPlatforms.find(
    (gp) => gp.platformGuildId === platformGuildId
  )
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform?.id)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()

  const { onSubmit, isLoading } = useEditRolePlatform({
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
        Edit availability
      </MenuItem>

      <EditRewardAvailabilityModal
        isOpen={isOpen}
        onClose={onClose}
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
