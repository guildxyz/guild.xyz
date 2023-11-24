import { useDisclosure } from "@chakra-ui/react"
import EditRewardAvailibiltyButton from "components/[guild]/RolePlatforms/components/EditRewardAvailibiltyButton"
import EditRewardAvailibiltyModal, {
  RolePlatformAvailibiltyForm,
} from "components/[guild]/RolePlatforms/components/EditRewardAvailibiltyModal"
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
      <EditRewardAvailibiltyButton
        onClick={onOpen}
        isCompact={showAvailibiltyTags}
      />
      <EditRewardAvailibiltyModal
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
