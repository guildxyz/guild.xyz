import { Link } from "@chakra-ui/next-js"
import { Icon, Skeleton, Text, Tooltip } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import { useUserFormSubmission } from "platforms/Forms/hooks/useFormSubmissions"
import rewards from "platforms/rewards"

const FormRequirement = (props: RequirementProps) => {
  const { urlName } = useGuild()
  const { data } = useRequirementContext()
  const { form } = useGuildForm(data?.id)
  const { userSubmission } = useUserFormSubmission(form)

  return (
    <Requirement image={<Icon as={rewards.FORM.icon} boxSize={6} />} {...props}>
      <Text as="span">{"Fill the "}</Text>
      <Tooltip
        label="Respone already submitted"
        isDisabled={!userSubmission}
        hasArrow
        placement="top"
      >
        <Skeleton display="inline" isLoaded={!!form}>
          <Link
            {...(!!userSubmission
              ? {
                  opacity: 0.6,
                  cursor: "not-allowed",
                  href: "#",
                }
              : { href: `/${urlName}/forms/${form?.id}` })}
            prefetch={false}
            colorScheme="blue"
          >
            {form?.name ?? "Loading form..."}
          </Link>
        </Skeleton>
      </Tooltip>
      <Text as="span">{" form"}</Text>
    </Requirement>
  )
}
export default FormRequirement
