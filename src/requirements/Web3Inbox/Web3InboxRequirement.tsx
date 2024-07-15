import { Link, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { PiArrowSquareOut } from "react-icons/pi"
import { APP_DETAILS } from "./Web3InboxForm"

const Web3InboxRequirement = (props: RequirementProps) => {
  const { id, roleId, data } = useRequirementContext()
  const { reqAccesses, isValidating } = useRoleMembership(roleId)
  const hasAccess = reqAccesses?.find((req) => req.requirementId === id)?.access

  return (
    <Requirement
      image={APP_DETAILS[data.app]?.image}
      footer={
        !isValidating &&
        !hasAccess && (
          <Link
            href="https://app.web3inbox.com"
            isExternal
            _hover={{
              textDecoration: "none",
            }}
          >
            <Button
              size="xs"
              colorScheme="WEB3INBOX"
              rightIcon={<PiArrowSquareOut />}
              iconSpacing={1}
            >
              Subscribe
            </Button>
          </Link>
        )
      }
      {...props}
    >
      <Text as="span">
        {`Subscribe to the ${APP_DETAILS[data.app]?.name} app on Web3Inbox`}
      </Text>
    </Requirement>
  )
}
export default Web3InboxRequirement
