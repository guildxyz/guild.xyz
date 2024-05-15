import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { targetRoleAtom } from "components/[guild]/RoleCard/components/EditRole/EditRole"
import useRequirements from "components/[guild]/hooks/useRequirements"
import DisplayCard from "components/common/DisplayCard"
import { Modal } from "components/common/Modal"
import AddRequirement from "components/create-guild/Requirements/components/AddRequirement"
import useCreateRequirement from "components/create-guild/Requirements/hooks/useCreateRequirement"
import { useAtomValue } from "jotai"
import { CaretRight } from "phosphor-react"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"
import { Requirement } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (roleId: number) => void
}

const BaseValueModal = ({ isOpen, onClose, onSelect }: Props) => {
  const targetRoleId = useAtomValue<number>(targetRoleAtom)
  const { data: requirements, mutate, isLoading } = useRequirements(targetRoleId)

  const dynamicRequirements =
    requirements?.filter((req) => !!REQUIREMENT_PROVIDED_VALUES[req.type]) || []

  const optionBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100")

  const {
    onSubmit: onCreateRequirementSubmit,
    isLoading: isCreateRequirementLoading,
  } = useCreateRequirement(targetRoleId, {
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0}>Select base value</ModalHeader>
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
                        <DisplayCard key={req.id} bg={optionBg} py={3}>
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

                <LogicDivider logic="OR" my={3} />
                <AddRequirement onAdd={addRequirement} />
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
                  <AddRequirement onAdd={addRequirement} />
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BaseValueModal
