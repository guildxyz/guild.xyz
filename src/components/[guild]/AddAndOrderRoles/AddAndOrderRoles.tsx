import {
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { CaretDown, ListNumbers, Plus } from "@phosphor-icons/react"
import Button from "components/common/Button"
import useIsStuck from "hooks/useIsStuck"
import { useEffect, useRef } from "react"
import RecheckAccessesButton from "../RecheckAccessesButton"
import useGuild from "../hooks/useGuild"
import AddRoleDrawer from "./components/AddRoleDrawer"
import OrderRolesModal from "./components/OrderRolesModal"

const AddAndOrderRoles = ({ setIsStuck = null }): JSX.Element => {
  const {
    isOpen: isAddDrawerOpen,
    onOpen: onAddDrawerOpen,
    onClose: onAddDrawerClose,
  } = useDisclosure()
  const {
    isOpen: isOrderModalOpen,
    onOpen: onOrderModalOpen,
    onClose: onOrderModalClose,
  } = useDisclosure()

  const orderButtonRef = useRef(null)
  const { ref: addRoleButtonRef, isStuck } = useIsStuck()
  useEffect(() => {
    setIsStuck?.(isStuck)
  }, [isStuck, setIsStuck])

  /**
   * Passing role IDs as the OrderRolesModal key, so we re-populate the form's default values when the admin adds a new role to their guild
   */
  const { roles } = useGuild()
  const orderRolesModalKey = roles?.map((r) => r.id).join("-")

  return (
    <>
      <ButtonGroup isAttached size="sm" variant="ghost" ml="auto">
        <Button
          ref={addRoleButtonRef}
          leftIcon={<Icon as={Plus} />}
          onClick={onAddDrawerOpen}
          data-test="add-role-button"
        >
          Add role
        </Button>
        <Divider orientation="vertical" h="8" />
        <RecheckAccessesButton
          tooltipLabel="Re-check all of my accesses"
          borderTopLeftRadius="0"
          borderBottomLeftRadius="0"
        />
        <Divider orientation="vertical" h="8" />
        <Menu placement="bottom-end">
          <MenuButton
            isActive={isOrderModalOpen}
            as={IconButton}
            icon={<CaretDown />}
            borderTopLeftRadius="0"
            borderBottomLeftRadius="0"
          />
          <MenuList>
            <MenuItem
              ref={orderButtonRef}
              onClick={onOrderModalOpen}
              icon={<ListNumbers />}
            >
              Reorder roles
            </MenuItem>
          </MenuList>
        </Menu>
      </ButtonGroup>
      <AddRoleDrawer
        isOpen={isAddDrawerOpen}
        onClose={onAddDrawerClose}
        finalFocusRef={addRoleButtonRef}
      />
      <OrderRolesModal
        key={orderRolesModalKey}
        isOpen={isOrderModalOpen}
        onClose={onOrderModalClose}
        finalFocusRef={orderButtonRef}
      />
    </>
  )
}

export default AddAndOrderRoles
