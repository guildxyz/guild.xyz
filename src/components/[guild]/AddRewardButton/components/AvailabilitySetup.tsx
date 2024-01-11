import { useDisclosure } from "@chakra-ui/react"
import EditRewardAvailabilityButton from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityButton"
import EditRewardAvailabilityModal, {
  RolePlatformAvailabilityForm,
} from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityModal"
import AvailabilityTags, {
  shouldShowAvailabilityTags,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import { PlatformName, RolePlatform } from "types"

type Props = {
  platformType: PlatformName
  rolePlatform?: RolePlatform
  defaultValues?: RolePlatformAvailabilityForm
  onDone: (data: RolePlatformAvailabilityForm) => void
}

const AvailabilitySetup = ({
  platformType,
  rolePlatform,
  defaultValues,
  onDone,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const showAvailabilityTags = shouldShowAvailabilityTags(rolePlatform)

  return (
    <AvailabilityTags rolePlatform={rolePlatform ?? ({} as RolePlatform)}>
      <EditRewardAvailabilityButton
        onClick={onOpen}
        isCompact={showAvailabilityTags}
      />
      <EditRewardAvailabilityModal
        defaultValues={defaultValues}
        isOpen={isOpen}
        onClose={onClose}
        platformType={platformType}
        onDone={(data) => {
          onDone(data)
          onClose()
        }}
      />
    </AvailabilityTags>
  )
}
export default AvailabilitySetup
