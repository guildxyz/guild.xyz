import { Icon, Tag, Tooltip, Wrap, useDisclosure } from "@chakra-ui/react"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useRequirements from "components/[guild]/hooks/useRequirements"
import { Lightning, Warning } from "phosphor-react"
import DynamicRewardModal from "platforms/Token/DynamicRewardModal"
import { Rest, RolePlatform } from "types"

const DynamicTag = ({
  rolePlatform,
  ...rest
}: { rolePlatform: RolePlatform } & Rest) => {
  const { isAdmin } = useGuildPermission()

  const { onOpen, isOpen, onClose } = useDisclosure()

  const { data: requirements } = useRequirements(rolePlatform.roleId)

  const dynamicAmount: any = rolePlatform.dynamicAmount
  const requirementId =
    dynamicAmount?.operation?.input?.[0]?.requirementId ||
    dynamicAmount?.operation?.input?.requirementId

  const linkedRequirement = requirements?.find((req) => req.id === requirementId)

  return (
    <>
      <Wrap spacing={1} {...rest}>
        <Tooltip label="Show details" hasArrow>
          <Tag
            fontWeight="semibold"
            _hover={{ cursor: "pointer" }}
            onClick={onOpen}
            w="fit-content"
          >
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
            <Tag colorScheme={"orange"} w="fit-content">
              <Icon as={Warning} mr={1} /> Missing linked requirement!
            </Tag>
          </Tooltip>
        )}
      </Wrap>

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
