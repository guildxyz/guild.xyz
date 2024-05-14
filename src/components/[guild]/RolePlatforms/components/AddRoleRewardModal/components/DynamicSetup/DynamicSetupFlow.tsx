import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { targetRoleAtom } from "components/[guild]/RoleCard/components/EditRole/EditRole"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import Button from "components/common/Button"
import DisplayCard from "components/common/DisplayCard"
import { Modal } from "components/common/Modal"
import { useAtomValue } from "jotai"
import { CaretRight } from "phosphor-react"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"

const DynamicSetupFlow = () => {
  const targetRoleId = useAtomValue<number>(targetRoleAtom)

  const { id: guildId } = useGuild()
  const { requirements, mutate } = useRole(guildId, targetRoleId)

  const dynamicRequirements =
    requirements?.filter((req) => !!REQUIREMENT_PROVIDED_VALUES[req.type]) || []

  const optionBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100")

  return (
    <Modal isOpen={true} onClose={() => {}}>
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
                {dynamicRequirements.map((req) => (
                  <DisplayCard key={req.id} bg={optionBg} py={3}>
                    <RequirementDisplayComponent
                      requirement={req}
                      dynamicDisplay
                      rightElement={<CaretRight />}
                    />
                  </DisplayCard>
                ))}
              </Stack>

              <LogicDivider logic="OR" my={3} />
              <Button w="full">Add new requirement</Button>
            </>
          ) : (
            <>
              <Text fontWeight={"semibold"} color={"GrayText"} mb={5}>
                You need to set up a requirement on this role first, to provide a
                base value for your dynamic reward.
              </Text>
              <Button w="full">Add new requirement</Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default DynamicSetupFlow
