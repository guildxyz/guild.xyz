import { Icon, Text, useDisclosure } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Button from "components/common/Button"
import { ArrowSquareIn, ListPlus } from "phosphor-react"
import SearchableVirtualListModal from "requirements/common/SearchableVirtualListModal"

const AllowlistRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext() as Extract<
    Schemas["Requirement"],
    { type: "ALLOWLIST" | "ALLOWLIST_EMAIL" }
  >

  const { addresses, hideAllowlist } = requirement.data

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Requirement
      image={<Icon as={ListPlus} boxSize={6} />}
      footer={
        hideAllowlist && (
          <Text color="gray" fontSize="xs" fontWeight="normal">
            Allowlisted{requirement.type === "ALLOWLIST_EMAIL" ? " email" : ""}{" "}
            addresses are hidden
          </Text>
        )
      }
      {...rest}
    >
      {"Be included in "}
      {hideAllowlist ? (
        `${requirement.type === "ALLOWLIST_EMAIL" ? "email " : ""}allowlist`
      ) : (
        <Button variant="link" rightIcon={<ArrowSquareIn />} onClick={onOpen}>
          {requirement.type === "ALLOWLIST_EMAIL" ? "email " : ""}allowlist
        </Button>
      )}
      <SearchableVirtualListModal
        initialList={addresses}
        isOpen={isOpen}
        onClose={onClose}
        title={
          requirement.type === "ALLOWLIST_EMAIL" ? "Email alllowlist" : "Allowlist"
        }
      />
    </Requirement>
  )
}

export default AllowlistRequirement
