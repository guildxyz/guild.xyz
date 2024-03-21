import { Icon, Text, useDisclosure } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Button from "components/common/Button"
import { ArrowSquareIn, ListPlus } from "phosphor-react"
import SearchableVirtualListModal from "requirements/common/SearchableVirtualListModal"

const AllowlistRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { addresses, hideAllowlist } = requirement.data

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Requirement
      image={<Icon as={ListPlus} boxSize={6} />}
      footer={
        hideAllowlist && (
          <Text color="gray" fontSize="xs" fontWeight="normal">
            Allowlisted addresses are hidden
          </Text>
        )
      }
      {...rest}
    >
      {"Be included in "}
      {hideAllowlist ? (
        "allowlist"
      ) : (
        <Button variant="link" rightIcon={<ArrowSquareIn />} onClick={onOpen}>
          allowlist
        </Button>
      )}
      <SearchableVirtualListModal
        initialList={addresses}
        isOpen={isOpen}
        onClose={onClose}
        title="Allowlist"
      />
    </Requirement>
  )
}

export default AllowlistRequirement
