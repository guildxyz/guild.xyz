import { Icon, Text, useDisclosure } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import SnapshotModal from "components/[guild]/leaderboard/Snapshots/SnapshotModal"
import Button from "components/common/Button"
import { ArrowSquareIn } from "phosphor-react"
import REQUIREMENTS from "requirements"

const AirdropRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext() as Extract<
    Schemas["Requirement"],
    { type: "GUILD_SNAPSHOT" }
  >

  const { isHidden } = requirement?.data

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Requirement
      image={<Icon as={REQUIREMENTS.GUILD_SNAPSHOT.icon as any} boxSize={6} />}
      footer={
        isHidden && (
          <Text color="gray" fontSize="xs" fontWeight="normal">
            {`Snapshot is hidden`}
          </Text>
        )
      }
      {...rest}
    >
      {"Be included in "}
      {isHidden ? (
        "this snapshot"
      ) : (
        <Button
          variant="link"
          rightIcon={<ArrowSquareIn />}
          iconSpacing={0.5}
          onClick={onOpen}
        >
          {"snapshot"}
        </Button>
      )}

      <SnapshotModal
        onClose={onClose}
        isOpen={isOpen}
        snapshotRequirement={requirement}
      />
    </Requirement>
  )
}

export default AirdropRequirement
