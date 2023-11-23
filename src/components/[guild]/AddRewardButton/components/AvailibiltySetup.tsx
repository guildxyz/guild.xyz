import { useDisclosure } from "@chakra-ui/react"
import EditRolePlatformAvailibiltyButton from "components/[guild]/RolePlatforms/components/EditRolePlatformAvailibiltyButton"
import EditRolePlatformAvailibiltyModal, {
  RolePlatformAvailibiltyForm,
} from "components/[guild]/RolePlatforms/components/EditRolePlatformAvailibiltyModal"
import AvailibiltyTags, {
  shouldShowAvailibiltyTags,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailibiltyTags"
import { PlatformName, RolePlatform } from "types"

type Props = {
  platformType: PlatformName
  rolePlatform?: RolePlatform
  defaultValues?: RolePlatformAvailibiltyForm
  onDone: (data: RolePlatformAvailibiltyForm) => void
}

const AvailibiltySetup = ({
  platformType,
  rolePlatform,
  defaultValues,
  onDone,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const showAvailibiltyTags = shouldShowAvailibiltyTags(rolePlatform)

  return (
    <AvailibiltyTags rolePlatform={rolePlatform ?? ({} as RolePlatform)}>
      <EditRolePlatformAvailibiltyButton
        onClick={onOpen}
        isCompact={showAvailibiltyTags}
      />
      <EditRolePlatformAvailibiltyModal
        defaultValues={defaultValues}
        isOpen={isOpen}
        onClose={onClose}
        platformType={platformType}
        onDone={(data) => {
          onDone(data)
          onClose()
        }}
      />
    </AvailibiltyTags>
  )
}
export default AvailibiltySetup
