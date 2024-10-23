import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { Reorder } from "framer-motion"
import { useController, useForm } from "react-hook-form"
import useReorderRoles from "../hooks/useReorderRoles"
import DraggableRoleCard from "./DraggableRoleCard"

type OrderRolesForm = {
  roleIds: number[]
}

const OrderRolesModal = ({ isOpen, onClose, finalFocusRef }): JSX.Element => {
  const { roles } = useGuild()
  const group = useRoleGroup()
  const relevantRoles = group
    ? roles?.filter((role) => role.groupId === group.id)
    : roles?.filter((role) => !role.groupId)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const publicAndSecretRoles = relevantRoles?.filter(
    (role) => role.visibility !== "HIDDEN"
  )

  const defaultRoleIdsOrder = publicAndSecretRoles?.map((role) => role.id)

  const {
    control,
    reset,
    formState: { isDirty },
    handleSubmit,
  } = useForm<OrderRolesForm>({
    mode: "all",
    defaultValues: { roleIds: defaultRoleIdsOrder },
  })
  const {
    field: { value: roleIdsOrder, onChange: onRoleIdsOrderChange },
  } = useController({
    control,
    name: "roleIds",
  })

  const { isLoading, onSubmit } = useReorderRoles(onClose)

  const onChangeRoleOrders = (data: OrderRolesForm) => {
    const changedRoles = data.roleIds
      .map((roleId, i) => ({
        id: roleId,
        position: i,
      }))
      .filter(({ id: roleId, position }) =>
        (relevantRoles ?? []).some(
          (prevRole) => prevRole.id === roleId && prevRole.position !== position
        )
      )

    return onSubmit(changedRoles)
  }

  const onCloseAndClear = () => {
    reset({ roleIds: defaultRoleIdsOrder })
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
              onReorder={(newOrder: number[]) => onRoleIdsOrderChange(newOrder)}
            >
              {relevantRoles?.length ? (
                roleIdsOrder?.map((roleId) => (
                  <Reorder.Item
                    key={roleId}
                    value={roleId}
                    style={{ position: "relative" }} // needed for the auto-applied zIndex to work
                  >
                    <DraggableRoleCard
                      role={relevantRoles?.find((role) => role.id === roleId)}
                    />
                  </Reorder.Item>
                ))
              ) : (
                <Text>No roles yet</Text>
              )}
            </Reorder.Group>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              onClick={handleSubmit(onChangeRoleOrders)}
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
