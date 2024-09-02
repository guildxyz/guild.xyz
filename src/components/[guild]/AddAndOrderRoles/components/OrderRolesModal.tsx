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
import { useMemo } from "react"
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
    ? roles.filter((role) => role.groupId === group.id)
    : roles.filter((role) => !role.groupId)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  // temporary, will order roles already in the SQL query in the future
  const sortedRoles = useMemo(() => {
    if (relevantRoles?.every((role) => role.position === null)) {
      const byMembers = relevantRoles?.sort(
        (role1, role2) => role2.memberCount - role1.memberCount
      )
      return byMembers
    }

    return (
      relevantRoles?.sort((role1, role2) => {
        if (role1.position === null) return 1
        if (role2.position === null) return -1
        return role1.position - role2.position
      }) ?? []
    )
  }, [relevantRoles])

  const publicAndSecretRoles = sortedRoles.filter(
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
