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
import { GearSix, PaintBrush, PencilSimple, Plus } from "phosphor-react"
import { useRef } from "react"
import AddRoleDrawer from "./components/AddRoleDrawer"
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

  const {
    isOpen: isAddRoleDrawerOpen,
    onOpen: onAddRoleDrawerOpen,
    onClose: onAddRoleDrawerClose,
  } = useDisclosure()

  const editGuildBtnRef = useRef()
  const addRoleBtnRef = useRef()

  return (
    <>
      <Menu>
        <MenuButton
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
            ref={editGuildBtnRef}
            py="2"
            cursor="pointer"
            onClick={onEditGuildDrawerOpen}
            icon={<GearSix />}
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

          {guild?.platforms?.[0]?.platformType !== "DISCORD" && (
            <MenuItem
              ref={addRoleBtnRef}
              py="2"
              cursor="pointer"
              onClick={onAddRoleDrawerOpen}
              icon={<Plus />}
            >
              Add role
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <EditGuildDrawer
        {...{
          isOpen: isEditGuildDrawerOpen,
          onClose: onEditGuildDrawerClose,
          finalFocusRef: editGuildBtnRef,
          children: null,
        }}
      />

      <CustomizationModal
        {...{
          isOpen: isCustomizationModalOpen,
          onClose: onCustomizationModalClose,
          children: null,
        }}
      />

      <AddRoleDrawer
        {...{
          isOpen: isAddRoleDrawerOpen,
          onClose: onAddRoleDrawerClose,
          finalFocusRef: addRoleBtnRef,
          children: null,
        }}
      />
    </>
  )
}

export default EditButtonGroup
