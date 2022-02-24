import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { GearSix, PaintBrush, PencilSimple } from "phosphor-react"
import { useRef } from "react"
import CustomizationModal from "./components/CustomizationModal"
import EditGuildDrawer from "./components/EditGuildDrawer"

const EditButtonGroup = (): JSX.Element => {
  const guild = useGuild()

  const {
    isOpen: isEditGuildDrawerOpen,
    onOpen: onEditGuildDrawerOpen,
    onClose: onEditGuildDrawerClose,
  } = useDisclosure()

  const {
    isOpen: isCustomizationModalOpen,
    onOpen: onCustomizationModalOpen,
    onClose: onCustomizationModalClose,
  } = useDisclosure()

  const menuBtnRef = useRef()

  return (
    <>
      <Menu>
        <MenuButton
          ref={menuBtnRef}
          as={IconButton}
          aria-label="Settings"
          minW={12}
          rounded="2xl"
          colorScheme="alpha"
        >
          <Icon width="1em" height="1em" as={PencilSimple} />
        </MenuButton>
        <MenuList border="none" shadow="md">
          <MenuItem
            py="2"
            cursor="pointer"
            icon={<GearSix />}
            onClick={onEditGuildDrawerOpen}
            data-dd-action-name="Edit guild"
          >
            Edit guild
          </MenuItem>

          <MenuItem
            py="2"
            cursor="pointer"
            icon={<PaintBrush />}
            onClick={onCustomizationModalOpen}
          >
            Customize appearance
          </MenuItem>
        </MenuList>
      </Menu>

      <EditGuildDrawer
        isOpen={isEditGuildDrawerOpen}
        onClose={onEditGuildDrawerClose}
        finalFocusRef={menuBtnRef}
      />

      <CustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={onCustomizationModalClose}
        finalFocusRef={menuBtnRef}
      />
    </>
  )
}

export default EditButtonGroup
