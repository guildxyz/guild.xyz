import { Wrap, useDisclosure } from "@chakra-ui/react"
import EditRolePlatformCapacityTimeButton from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTimeButton"
import EditRolePlatformCapacityTimeModal from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTimeModal"
import CapacityTimeTags, {
  shouldShowCapacityTimeTags,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/CapacityTimeTags"
import { useFormContext, useWatch } from "react-hook-form"
import { PlatformName } from "types"

type Props = { platformType: PlatformName }

const CapacityTimeSetup = ({ platformType }: Props) => {
  const { setValue } = useFormContext()
  const rolePlatform = useWatch({
    name: "rolePlatforms.0",
  })

  const capacityFromGuildPlatform =
    rolePlatform?.guildPlatform?.platformGuildData?.texts?.length

  const { isOpen, onOpen, onClose } = useDisclosure()
  const showCapacityTimeTags = shouldShowCapacityTimeTags(rolePlatform)

  return (
    <Wrap>
      <CapacityTimeTags rolePlatform={rolePlatform ?? {}} />

      <EditRolePlatformCapacityTimeButton
        onClick={onOpen}
        isCompact={showCapacityTimeTags}
      />
      <EditRolePlatformCapacityTimeModal
        defaultValues={{
          capacity: capacityFromGuildPlatform,
          startTime: rolePlatform?.startTime,
          endTime: rolePlatform?.endTime,
        }}
        isOpen={isOpen}
        onClose={onClose}
        platformType={platformType}
        onDone={({ capacity, startTime, endTime }) => {
          setValue(`rolePlatforms.0.capacity`, capacity)
          setValue(`rolePlatforms.0.startTime`, startTime)
          setValue(`rolePlatforms.0.endTime`, endTime)
          onClose()
        }}
      />
    </Wrap>
  )
}
export default CapacityTimeSetup
