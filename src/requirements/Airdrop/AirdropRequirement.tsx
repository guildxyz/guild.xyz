import { Icon, Text, useDisclosure } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Button from "components/common/Button"
import { ArrowSquareIn } from "phosphor-react"
import REQUIREMENTS from "requirements"
import SearchableVirtualListModal from "requirements/common/SearchableVirtualListModal"

const AirdropRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext() as Extract<
    Schemas["Requirement"],
    { type: "GUILD_SNAPSHOT" }
  >

  const { snapshot, isHidden } = requirement?.data

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
        "snapshot"
      ) : (
        <Button variant="link" rightIcon={<ArrowSquareIn />} onClick={onOpen}>
          {"snapshot"}
        </Button>
      )}
      <SearchableVirtualListModal
        initialList={snapshot.map(({ key, value }) => `${key}: ${value}`)}
        isOpen={isOpen}
        onClose={onClose}
        title={"Snapshot"}
      />
    </Requirement>
  )
}

export default AirdropRequirement
