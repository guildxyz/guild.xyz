import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { RequirementType } from "requirements"

const problematicTwitterRequirements: RequirementType[] = [
  "TWITTER_FOLLOW",
  "TWITTER_FOLLOWED_BY",
  "TWITTER_LIST_FOLLOW",
  "TWITTER_LIST_MEMBER",
]

const TwitterRequirementsVerificationIssuesAlert = () => {
  const { roles } = useGuild()
  const hasTwitterFollowRequirements = roles
    ?.flatMap((r) => r.requirements)
    .some((req) => problematicTwitterRequirements.includes(req.type))

  if (!hasTwitterFollowRequirements) return null

  return (
    <Alert mb={4} status="warning">
      <AlertIcon />

      <AlertDescription>
        Access verification may be limited due to Twitter API issues.
      </AlertDescription>
    </Alert>
  )
}
export default TwitterRequirementsVerificationIssuesAlert
