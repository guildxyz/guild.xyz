import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import LogicDivider from "components/[guild]/LogicDivider"
import { useRequirementHandlerContext } from "components/[guild]/RequirementHandlerContext"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import DisplayCard from "components/common/DisplayCard"
import { Modal } from "components/common/Modal"
import AddRequirement from "components/create-guild/Requirements/components/AddRequirement"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirementProvidedValues"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (reqId: number | string) => void
}

const BaseValueModal = ({ isOpen, onClose, onSelect }: Props) => {
  const {
    requirements,
    requirementsLoading,
    addRequirementLoading,
    onAddRequirement,
  } = useRequirementHandlerContext()

  const dynamicRequirements =
    requirements?.filter((req) => !!REQUIREMENT_PROVIDED_VALUES[req.type]) || []

  const Loader = () => (
    <VStack my={5}>
      <Spinner />
      <Text color={"GrayText"}>Fetching requirements...</Text>
    </VStack>
  )

  const handleSelect = (reqId: number | string) => {
    onSelect(reqId)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        colorScheme={"dark"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4}>Select base value</ModalHeader>
          <ModalBody>
            {dynamicRequirements?.length > 0 ? (
              <>
                <Text fontWeight={"semibold"} color={"GrayText"} mb={5}>
                  Choose a base value provided by a requirement on this role.
                </Text>
                <Stack>
                  {addRequirementLoading || requirementsLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {dynamicRequirements.map((req) => (
                        <DisplayCard
                          key={req.id}
                          py={3}
                          onClick={() => handleSelect(req.id)}
                          boxShadow="none"
                          borderWidth="1px"
                        >
                          <RequirementDisplayComponent
                            requirement={req}
                            dynamicDisplay
                            rightElement={<CaretRight />}
                          />
                        </DisplayCard>
                      ))}
                    </>
                  )}
                </Stack>

                <LogicDivider logic="OR" my={2} />
                <AddRequirement onAdd={onAddRequirement} providerTypesOnly />
              </>
            ) : (
              <>
                <Text fontWeight={"semibold"} color={"GrayText"} mb={5}>
                  You need to set up a requirement on this role first, to provide a
                  base value for your dynamic reward.
                </Text>
                {addRequirementLoading || requirementsLoading ? (
                  <Loader />
                ) : (
                  <AddRequirement onAdd={onAddRequirement} providerTypesOnly />
                )}
              </>
            )}
            <Text color={"GrayText"} fontSize={"sm"} mt={5}>
              Note: Not all requirements provide a dynamic value. Newly added
              requirements can also influence access to the role.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BaseValueModal
