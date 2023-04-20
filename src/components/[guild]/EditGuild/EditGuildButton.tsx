import { IconButton, useDisclosure } from "@chakra-ui/react"
import OnboardingMarker from "components/common/OnboardingMarker"
import { GearSix } from "phosphor-react"
import EditGuildDrawer from "./EditGuildDrawer"

const EditGuildButton = (): JSX.Element => {
  const {
    isOpen: isEditGuildOpen,
    onOpen: onEditGuildOpen,
    onClose: onEditGuildClose,
  } = useDisclosure()

  return (
    <>
      <OnboardingMarker step={1}>
        <IconButton
          icon={<GearSix />}
          aria-label="Edit Guild"
          minW={"44px"}
          rounded="full"
          colorScheme="alpha"
          onClick={onEditGuildOpen}
        />
      </OnboardingMarker>

      <EditGuildDrawer
        {...{
          isOpen: isEditGuildOpen,
          onClose: onEditGuildClose,
        }}
      />
    </>
  )
}

export default EditGuildButton
