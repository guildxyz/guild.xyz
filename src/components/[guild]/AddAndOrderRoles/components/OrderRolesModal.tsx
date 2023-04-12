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
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo, useState } from "react"
import fetcher from "utils/fetcher"
import DraggableRoleCard from "./DraggableRoleCard"

const OrderRolesModal = ({ isOpen, onClose, finalFocusRef }): JSX.Element => {
  const { id, roles, mutateGuild } = useGuild()
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  // temporary, will order roles already in the SQL query in the future
  const defaultRoleIds = useMemo(
    () =>
      roles
        ?.sort((role1, role2) => role1.position - role2.position)
        ?.map((role) => role.id),
    [roles]
  )

  const [roleIds, setRoleIds] = useState(defaultRoleIds)
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = (signedValidation: SignedValdation) =>
    fetcher(`/guild/${id}/roles`, {
      method: "PATCH",
      ...signedValidation,
    })

  const { onSubmit, isLoading } = useSubmitWithSign(submit, {
    onSuccess: (res) => {
      toast({
        status: "success",
        title: "Successfully edited role order",
      })
      onClose()
      mutateGuild(
        (oldData) => ({
          ...oldData,
          /**
           * Can't do just `roles: res`, because the requirements aren't included in
           * the role objects in the response. After the API refactor (when they
           * won't be in the original guild state anyway) we'll be able to switch to
           * that
           */
          roles: oldData.roles.map((role) => ({
            ...role,
            position: res.find((resRole) => resRole.id === role.id).position,
          })),
        }),
        { revalidate: false }
      )
    },
    onError: (err) => showErrorToast(err),
  })

  const isDirty = JSON.stringify(defaultRoleIds) !== JSON.stringify(roleIds)

  const handleSubmit = () =>
    onSubmit(roleIds.map((roleId, i) => ({ id: roleId, position: i })))

  const onCloseAndClear = () => {
    setRoleIds(defaultRoleIds)
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
            <Reorder.Group axis="y" values={roleIds} onReorder={setRoleIds}>
              {roleIds?.map((roleId) => (
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
