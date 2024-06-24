import { useDisclosure } from "@chakra-ui/react"
import EditRewardAvailabilityButton from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityButton"
import EditRewardAvailabilityModal, {
  RolePlatformAvailabilityForm,
} from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityModal"
import AvailabilityTags, {
  shouldShowAvailabilityTags,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import { PlatformName, RoleFormType, RolePlatform } from "types"

type Props = {
  platformType: PlatformName
  rolePlatform?: NonNullable<RoleFormType["rolePlatforms"]>[number]
  defaultValues?: RolePlatformAvailabilityForm
  onDone: (data: RolePlatformAvailabilityForm) => void
  isLoading?: boolean
}

const AvailabilitySetup = ({
  platformType,
  rolePlatform,
  defaultValues,
  onDone,
  isLoading,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const showAvailabilityTags = shouldShowAvailabilityTags(rolePlatform)

  // If claim is already started by date, and thats the only limitation, show the full button
  const notCompact =
    !rolePlatform?.capacity &&
    !rolePlatform?.endTime &&
    rolePlatform?.startTime &&
    new Date(rolePlatform.startTime).getTime() < Date.now()

  return (
    <AvailabilityTags rolePlatform={rolePlatform ?? ({} as RolePlatform)}>
      <EditRewardAvailabilityButton
        onClick={onOpen}
        isCompact={!notCompact && showAvailabilityTags}
      />
      <EditRewardAvailabilityModal
        defaultValues={defaultValues}
        isOpen={isOpen}
        onClose={onClose}
        platformType={platformType}
        isLoading={isLoading}
        onDone={async (data) => {
          await onDone(data)
          onClose()
        }}
      />
    </AvailabilityTags>
  )
}
export default AvailabilitySetup
