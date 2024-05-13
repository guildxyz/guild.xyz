import { Icon, Tag, Tooltip, useDisclosure } from "@chakra-ui/react"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useRequirements from "components/[guild]/hooks/useRequirements"
import { Lightning, Warning } from "phosphor-react"
import DynamicRewardModal from "platforms/Token/DynamicRewardModal"
import { RolePlatform } from "types"

const DynamicTag = ({ rolePlatform }: { rolePlatform: RolePlatform }) => {
  const { isAdmin } = useGuildPermission()

  const { onOpen, isOpen, onClose } = useDisclosure()

  const { data: requirements } = useRequirements(rolePlatform.roleId)
  const linkedRequirement = requirements?.find(
    (req) => req.id === rolePlatform.dynamicAmount?.operation.input[0].requirementId
  )

  return (
    <>
      <Tooltip label="Show details" hasArrow>
        <Tag fontWeight="semibold" _hover={{ cursor: "pointer" }} onClick={onOpen}>
          <Icon
            boxSize={"13px"}
            weight="fill"
            color="green.500"
            as={Lightning}
            mr={1}
          />
          Dynamic
        </Tag>
      </Tooltip>

      {isAdmin && !linkedRequirement && (
        <Tooltip
          hasArrow
          label="Dynamic rewards need a base value for reward amount calculation from a requirement. Edit the reward to set one!"
        >
          <Tag colorScheme={"orange"}>
            <Icon as={Warning} mr={1} /> Missing linked requirement!
          </Tag>
        </Tooltip>
      )}

      <DynamicRewardModal
        onClose={onClose}
        isOpen={isOpen}
        rolePlatform={rolePlatform}
        linkedRequirement={linkedRequirement}
      ></DynamicRewardModal>
    </>
  )
}

export default DynamicTag
