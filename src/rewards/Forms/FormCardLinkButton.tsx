import { Check } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Link from "next/link"
import rewards from "rewards"
import { RewardCardButton } from "rewards/components/RewardCardButton"
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
      <RewardCardButton
        as={Link}
        href={`/${urlName}/forms/${form?.id}/responses`}
        prefetch={false}
        variant="outline"
      >
        View responses
      </RewardCardButton>
    )

  return (
    <RewardCardButton
      as={Link}
      isDisabled={!form || !!userSubmission}
      isLoading={isFormsValidating || isValidating}
      prefetch={false}
      href={!!form && !userSubmission ? `/${urlName}/forms/${form?.id}` : "#"}
      colorScheme={rewards.FORM.colorScheme}
      leftIcon={userSubmission && <Check />}
    >
      {userSubmission ? "Already submitted" : "Fill form"}
    </RewardCardButton>
  )
}
export default FormCardLinkButton
