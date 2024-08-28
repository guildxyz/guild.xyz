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
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { Reorder } from "framer-motion"
import { MutableRefObject, useMemo, useState } from "react"
import { Requirement } from "types"
import { useReorderRequirements } from "../hooks/useReorderRequirements"
import { DraggableRequirementCard } from "./DraggableRequirementCard"

const OrderRequirementsModal = ({
  isOpen,
  onClose,
  finalFocusRef,
  requirements,
  roleId,
}: {
  isOpen: boolean
  onClose: () => void
  finalFocusRef: MutableRefObject<null>
  requirements: Requirement[]
  roleId: number
}): JSX.Element => {
  // const { requirements } = useGuild()
  // const group = useRequirementGroup()
  const relevantRequirements = requirements
  // group
  // ? requirements.filter((requirement) => requirement.groupId === group.id)
  // : requirements.filter((requirement) => !requirement.groupId)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  // temporary, will order requirements already in the SQL query in the future
  const sortedRequirements = useMemo(() => {
    if (
      relevantRequirements?.every((requirement) => requirement.position === null)
    ) {
      const byMembers = relevantRequirements?.sort(
        (requirement1, requirement2) =>
          requirement2.createdAt.valueOf() - requirement1.createdAt.valueOf()
      )
      return byMembers
    }

    return (
      relevantRequirements?.sort((requirement1, requirement2) => {
        if (requirement1.position === null) return 1
        if (requirement2.position === null) return -1
        return requirement1.position - requirement2.position
      }) ?? []
    )
  }, [relevantRequirements])

  const publicAndSecretRequirements = sortedRequirements.filter(
    (requirement) => requirement.visibility !== "HIDDEN"
  )

  const defaultRequirementIdsOrder = publicAndSecretRequirements?.map(
    (requirement) => requirement.id
  )
  const [requirementIdsOrder, setRequirementIdsOrder] = useState(
    defaultRequirementIdsOrder
  )

  /**
   * Using JSON.stringify to compare the values, not the object identity (so it works
   * as expected after a successful save too)
   */
  const isDirty =
    JSON.stringify(defaultRequirementIdsOrder) !==
    JSON.stringify(requirementIdsOrder)

  const { isLoading, onSubmit } = useReorderRequirements(onClose, roleId)

  const handleSubmit = () => {
    const changedRequirements = requirementIdsOrder
      .map((requirementId, i) => ({
        id: requirementId,
        position: i,
      }))
      .filter(({ id: requirementId, position }) =>
        (relevantRequirements ?? []).some(
          (prevRequirement) =>
            prevRequirement.id === requirementId &&
            prevRequirement.position !== position
        )
      )

    console.log(changedRequirements)
    return onSubmit(changedRequirements)
  }

  const onCloseAndClear = () => {
    setRequirementIdsOrder(defaultRequirementIdsOrder)
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
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Requirement order</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="custom-scrollbar">
            <Reorder.Group
              axis="y"
              values={requirementIdsOrder}
              onReorder={setRequirementIdsOrder}
            >
              {relevantRequirements?.length ? (
                requirementIdsOrder?.map((requirementId) => (
                  <Reorder.Item
                    key={requirementId}
                    value={requirementId}
                    style={{ position: "relative" }} // needed for the auto-applied zIndex to work
                  >
                    <DraggableRequirementCard
                      requirement={
                        relevantRequirements?.find(
                          (requirement) => requirement.id === requirementId
                        )!
                      }
                    />
                  </Reorder.Item>
                ))
              ) : (
                <Text>No requirements yet</Text>
              )}
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

export default OrderRequirementsModal
