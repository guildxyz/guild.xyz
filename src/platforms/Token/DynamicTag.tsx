import { Icon, Tag, Tooltip, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useRequirements from "components/[guild]/hooks/useRequirements"
import { Lightning, Warning } from "phosphor-react"
import DynamicRewardModal from "./DynamicRewardModal"
import { useTokenRewardContext } from "./TokenRewardContext"
import useRolePlatformsOfReward from "./hooks/useRolePlatformsOfReward"

const DynamicTag = () => {
  const { isAdmin } = useGuildPermission()

  const { onOpen, isOpen, onClose } = useDisclosure()

  const {
    guildPlatform: { id: guildPlatformId },
  } = useTokenRewardContext()

  const { roles } = useGuild()
  const rolePlatforms = useRolePlatformsOfReward(guildPlatformId)
  const role = roles.find((rl) =>
    rl.rolePlatforms.find((rp) => rp.id === rolePlatforms[0].id)
  )

  const { data: requirements } = useRequirements(role.id)
  const linkedRequirement = requirements?.find((req) => !!req.data.snapshot)

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
        <Tooltip hasArrow label="Add a snapshot by editing this reward">
          <Tag colorScheme={"orange"}>
            <Icon as={Warning} mr={1} /> Missing snapshot
          </Tag>
        </Tooltip>
      )}

      <DynamicRewardModal
        onClose={onClose}
        isOpen={isOpen}
        rolePlatform={rolePlatforms[0]}
        linkedRequirement={linkedRequirement}
      ></DynamicRewardModal>
    </>
  )
}

export default DynamicTag
