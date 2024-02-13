import { Icon, Skeleton, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { ArrowSquareIn } from "phosphor-react"
import useUserSubmission from "platforms/Forms/hooks/useUserSubmission"
import platforms from "platforms/platforms"

const FormRequirement = (props: RequirementProps) => {
  const { urlName } = useGuild()
  const { data } = useRequirementContext()
  const { data: forms, isValidating: isFormsValidating } = useForms()
  const form = forms?.find((f) => f.id === data?.id)
  const { data: userSubmission, isValidating } = useUserSubmission(form)

  return (
    <Requirement
      image={<Icon as={platforms.FORM.icon} boxSize={6} />}
      footer={
        <LinkButton
          isDisabled={!form || !!userSubmission}
          isLoading={isFormsValidating || isValidating}
          prefetch={false}
          href={!!form && !userSubmission ? `/${urlName}/forms/${form?.id}` : "#"}
          colorScheme="blue"
          size="xs"
          rightIcon={<Icon as={ArrowSquareIn} />}
          borderRadius="md"
          fontWeight="medium"
        >
          Fill form
        </LinkButton>
      }
      {...props}
    >
      <Text as="span">{"Fill the "}</Text>
      <Skeleton display="inline-block" isLoaded={!!form}>
        {form?.name ?? "Loading form..."}
      </Skeleton>
      <Text as="span">{" form"}</Text>
    </Requirement>
  )
}
export default FormRequirement
