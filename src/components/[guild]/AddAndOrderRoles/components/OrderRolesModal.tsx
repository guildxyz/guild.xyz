import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { Reorder } from "framer-motion"
import useIsV2 from "hooks/useIsV2"
import { useMemo, useState } from "react"
import useReorderRoles from "../hooks/useReorderRoles"
import DraggableRoleCard from "./DraggableRoleCard"

const OrderRolesModal = ({ isOpen, onClose, finalFocusRef }): JSX.Element => {
  const { roles } = useGuild()
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()
  const isV2 = useIsV2()

  // temporary, will order roles already in the SQL query in the future
  const sortedRoles = useMemo(() => {
    if (roles.every((role) => role.position === null)) {
      const byMembers = roles?.sort(
        (role1, role2) => role2.memberCount - role1.memberCount
      )
      return byMembers
    }

    return roles?.sort((role1, role2) => {
      if (role1.position === null) return 1
      if (role2.position === null) return -1
      return role1.position - role2.position
    })
  }, [roles])

  const defaultRoleIdsOrder = sortedRoles?.map((role) => role.id)
  const [roleIdsOrder, setRoleIdsOrder] = useState(defaultRoleIdsOrder)

  /**
   * Using JSON.stringify to compare the values, not the object identity (so it works
   * as expected after a successful save too)
   */
  const isDirty =
    JSON.stringify(defaultRoleIdsOrder) !== JSON.stringify(roleIdsOrder)

  const { isLoading, onSubmit } = useReorderRoles(onClose)

  const handleSubmit = () => {
    if (isV2) {
      const changedRoles = roleIdsOrder
        .map((roleId, i) => ({
          id: roleId,
          position: i,
        }))
        .filter(({ id: roleId, position }) =>
          (roles ?? []).some(
            (prevRole) => prevRole.id === roleId && prevRole.position !== position
          )
        )

      return onSubmit(changedRoles)
    } else {
      onSubmit(roleIdsOrder.map((roleId, i) => ({ id: roleId, position: i })))
    }
  }

  const onCloseAndClear = () => {
    setRoleIdsOrder(defaultRoleIdsOrder)
    onClose()
    onAlertClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={isDirty ? onAlertOpen : onClose}
        colorScheme="dark"
        finalFocusRef={finalFocusRef}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Role order</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="custom-scrollbar">
            <Reorder.Group
              axis="y"
              values={roleIdsOrder}
              onReorder={setRoleIdsOrder}
            >
              {roleIdsOrder?.map((roleId) => (
                <Reorder.Item key={roleId} value={roleId}>
                  <DraggableRoleCard
                    role={roles.find((role) => role.id === roleId)}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              onClick={handleSubmit}
              colorScheme="green"
              isDisabled={!isDirty}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}

export default OrderRolesModal
