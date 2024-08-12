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
          ></MenuButton>
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
        isOpen={isOrderModalOpen}
        onClose={onOrderModalClose}
        finalFocusRef={orderButtonRef}
      />
    </>
  )
}

export default AddAndOrderRoles
