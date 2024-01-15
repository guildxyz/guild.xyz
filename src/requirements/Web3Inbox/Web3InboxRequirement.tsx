import { Link, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useAccess from "components/[guild]/hooks/useAccess"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { APP_DETAILS } from "./Web3InboxForm"

const Web3InboxRequirement = (props: RequirementProps) => {
  const { id, roleId, data } = useRequirementContext()
  const { data: roleAccess, isValidating } = useAccess(roleId)
  const hasAccess = roleAccess?.requirements.find(
    (req) => req.requirementId === id
  )?.access

  return (
    <Requirement
      image={APP_DETAILS[data.app].image}
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
            <Button size="xs" colorScheme="WEB3INBOX" rightIcon={<ArrowSquareOut />}>
              Subscribe
            </Button>
          </Link>
        )
      }
      {...props}
    >
      <Text as="span">
        {`Subscribe to ${APP_DETAILS[data.app].name} on Web3Inbox`}
      </Text>
    </Requirement>
  )
}
export default Web3InboxRequirement
