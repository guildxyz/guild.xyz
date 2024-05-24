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
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import useRequirements from "components/[guild]/hooks/useRequirements"
import DisplayCard from "components/common/DisplayCard"
import { Modal } from "components/common/Modal"
import AddRequirement from "components/create-guild/Requirements/components/AddRequirement"
import useCreateRequirement from "components/create-guild/Requirements/hooks/useCreateRequirement"
import { CaretRight } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"
import { Requirement } from "types"

type Props = {
  roleId: number
  isOpen: boolean
  onClose: () => void
  onSelect: (reqId: number) => void
}

const BaseValueModal = ({ roleId, isOpen, onClose, onSelect }: Props) => {
  const { data: requirements, mutate, isLoading } = useRequirements(roleId)

  const dynamicRequirements =
    requirements?.filter((req) => !!REQUIREMENT_PROVIDED_VALUES[req.type]) || []

  const {
    onSubmit: onCreateRequirementSubmit,
    isLoading: isCreateRequirementLoading,
  } = useCreateRequirement(roleId, {
    onSuccess: () => {
      mutate()
    },
    onError: () => {},
  })

  const addRequirement = (req: Requirement) => {
    onCreateRequirementSubmit(req)
  }

  const Loader = () => (
    <VStack my={5}>
      <Spinner />
      <Text color={"GrayText"}>Fetching requirements...</Text>
    </VStack>
  )

  const { setValue } = useFormContext()

  const handleSelect = (reqId: number) => {
    setValue("dynamic.requirementId", reqId)
    onSelect(reqId)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} colorScheme={"dark"}>
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
                  {isLoading || isCreateRequirementLoading ? (
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
                <AddRequirement onAdd={addRequirement} providerTypesOnly />
              </>
            ) : (
              <>
                <Text fontWeight={"semibold"} color={"GrayText"} mb={5}>
                  You need to set up a requirement on this role first, to provide a
                  base value for your dynamic reward.
                </Text>
                {isLoading || isCreateRequirementLoading ? (
                  <Loader />
                ) : (
                  <AddRequirement onAdd={addRequirement} providerTypesOnly />
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
