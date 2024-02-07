import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { Check } from "phosphor-react"
import { GuildPlatform } from "types"
import useUserSubmission from "./hooks/useUserSubmission"

type Props = {
  platform: GuildPlatform
}

const FormCardLinkButton = ({ platform }: Props) => {
  const { urlName } = useGuild()
  const { data, isValidating: isFormsValidating } = useForms()

  const form = data?.find((f) => f.id === platform.platformGuildData?.formId)

  const { data: userSubmission, isValidating } = useUserSubmission(form)

  return (
    <LinkButton
      isDisabled={!!userSubmission}
      isLoading={isFormsValidating || isValidating}
      prefetch={false}
      href={!userSubmission ? `/${urlName}/forms/${form?.id}` : "#"}
      size="lg"
      w="full"
      colorScheme="GUILD"
      leftIcon={userSubmission && <Check />}
    >
      {userSubmission ? "Response already submitted" : "Fill form"}
    </LinkButton>
  )
}
export default FormCardLinkButton
