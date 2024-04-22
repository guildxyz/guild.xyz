import { HStack, Icon, Text, useDisclosure } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import RequirementConnectButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { ArrowSquareIn, ListPlus } from "phosphor-react"
import SearchableVirtualListModal from "requirements/common/SearchableVirtualListModal"

function HiddenAllowlistText({ isEmail }: { isEmail: boolean }) {
  return (
    <Text color="gray" fontSize="xs" fontWeight="normal">
      {`Allowlisted ${isEmail ? " email" : ""} addresses are hidden`}
    </Text>
  )
}

const AllowlistRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext() as Extract<
    Schemas["Requirement"],
    { type: "ALLOWLIST" | "ALLOWLIST_EMAIL" }
  >

  const { addresses, hideAllowlist } = requirement.data

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isEmail = requirement.type === "ALLOWLIST_EMAIL"

  const { reqAccesses } = useRoleMembership(requirement.roleId)

  const hasAccess = reqAccesses?.find(
    ({ requirementId }) => requirementId === requirement.id
  )?.access

  return (
    <Requirement
      image={<Icon as={ListPlus} boxSize={6} />}
      footer={
        isEmail ? (
          <HStack>
            {!hasAccess && <RequirementConnectButton />}
            <HiddenAllowlistText isEmail={isEmail} />
          </HStack>
        ) : (
          hideAllowlist && <HiddenAllowlistText isEmail={isEmail} />
        )
      }
      {...rest}
    >
      {"Be included in "}
      {hideAllowlist ? (
        `${isEmail ? "email " : ""}allowlist`
      ) : (
        <Button variant="link" rightIcon={<ArrowSquareIn />} onClick={onOpen}>
          {`${isEmail ? "email " : ""}allowlist`}
        </Button>
      )}
      <SearchableVirtualListModal
        initialList={addresses}
        isOpen={isOpen}
        onClose={onClose}
        title={isEmail ? "Email allowlist" : "Allowlist"}
      />
    </Requirement>
  )
}

export default AllowlistRequirement
