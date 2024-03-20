import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import { LinkButton } from "components/common/LinkMenuItem"
import Link from "next/link"
import { Check } from "phosphor-react"
import rewards from "platforms/rewards"
import { GuildPlatform } from "types"
import { useUserFormSubmission } from "./hooks/useFormSubmissions"

type Props = {
  platform: GuildPlatform
}

const FormCardLinkButton = ({ platform }: Props) => {
  const { urlName } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { form, isValidating: isFormsValidating } = useGuildForm(
    platform.platformGuildData?.formId
  )

  const { userSubmission, isValidating } = useUserFormSubmission(form)

  if (isAdmin && !!userSubmission)
    return (
      <LinkButton
        href={`/${urlName}/forms/${form?.id}/responses`}
        prefetch={false}
        w="full"
        variant={"outline"}
      >
        View responses
      </LinkButton>
    )

  return (
    <Button
      as={Link}
      isDisabled={!form || !!userSubmission}
      isLoading={isFormsValidating || isValidating}
      prefetch={false}
      href={!!form && !userSubmission ? `/${urlName}/forms/${form?.id}` : "#"}
      w="full"
      colorScheme={rewards.FORM.colorScheme}
      leftIcon={userSubmission && <Check />}
    >
      {userSubmission ? "Already submitted" : "Fill form"}
    </Button>
  )
}
export default FormCardLinkButton
