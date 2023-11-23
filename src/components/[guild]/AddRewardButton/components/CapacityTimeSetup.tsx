import { useDisclosure } from "@chakra-ui/react"
import EditRolePlatformCapacityTimeButton from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTimeButton"
import EditRolePlatformCapacityTimeModal, {
  RolePlatformCapacityTimeForm,
} from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTimeModal"
import CapacityTimeTags, {
  shouldShowCapacityTimeTags,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/CapacityTimeTags"
import { PlatformName, RolePlatform } from "types"

type Props = {
  platformType: PlatformName
  rolePlatform?: RolePlatform
  defaultValues?: RolePlatformCapacityTimeForm
  onDone: (data: RolePlatformCapacityTimeForm) => void
}

const CapacityTimeSetup = ({
  platformType,
  rolePlatform,
  defaultValues,
  onDone,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const showCapacityTimeTags = shouldShowCapacityTimeTags(rolePlatform)

  return (
    <CapacityTimeTags rolePlatform={rolePlatform ?? ({} as RolePlatform)}>
      <EditRolePlatformCapacityTimeButton
        onClick={onOpen}
        isCompact={showCapacityTimeTags}
      />
      <EditRolePlatformCapacityTimeModal
        defaultValues={defaultValues}
        isOpen={isOpen}
        onClose={onClose}
        platformType={platformType}
        onDone={(data) => {
          onDone(data)
          onClose()
        }}
      />
    </CapacityTimeTags>
  )
}
export default CapacityTimeSetup
