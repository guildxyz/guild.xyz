import { Icon, Skeleton, Text, Tooltip } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import Link from "components/common/Link"
import useUserSubmission from "platforms/Forms/hooks/useUserSubmission"
import platforms from "platforms/platforms"

const FormRequirement = (props: RequirementProps) => {
  const { urlName } = useGuild()
  const { data } = useRequirementContext()
  const { data: forms } = useForms()
  const form = forms?.find((f) => f.id === data?.id)
  const { data: userSubmission } = useUserSubmission(form)

  return (
    <Requirement image={<Icon as={platforms.FORM.icon} boxSize={6} />} {...props}>
      <Text as="span">{"Fill the "}</Text>
      <Tooltip
        label="Respone already submitted"
        isDisabled={!userSubmission}
        hasArrow
        placement="top"
      >
        <Skeleton display="inline-block" isLoaded={!!form}>
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
