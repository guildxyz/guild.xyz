import { buttonVariants } from "@/components/ui/Button"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { APP_DETAILS } from "./constants"

const Web3InboxRequirement = (props: RequirementProps) => {
  const { id, roleId, data } = useRequirementContext<"WEB3INBOX_SUBSCRIBERS">()
  const { reqAccesses, isValidating } = useRoleMembership(roleId)
  const hasAccess = reqAccesses?.find((req) => req.requirementId === id)?.access

  return (
    <Requirement
      image={APP_DETAILS[data.app]?.image}
      footer={
        !isValidating &&
        !!hasAccess && (
          <a
            href="https://app.web3inbox.com"
            className={buttonVariants({
              size: "xs",
              className:
                "bg-web3inbox text-white hover:bg-web3inbox-hover hover:no-underline active:bg-web3inbox-active",
            })}
          >
            <span>Subscribe</span>
            <ArrowSquareOut weight="bold" />
          </a>
        )
      }
      {...props}
    >
      {`Subscribe to the ${APP_DETAILS[data.app]?.name} app on Web3Inbox`}
    </Requirement>
  )
}
export default Web3InboxRequirement
