import { ArrowRight, Check } from "@phosphor-icons/react"
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

  if (isFormsValidating || isValidating) return <RewardCardButton isLoading />
  if (!form) return <RewardCardButton isDisabled>Form not found</RewardCardButton>

  if (!userSubmission)
    return (
      <RewardCardButton
        as={Link}
        prefetch={false}
        href={`/${urlName}/forms/${form?.id}`}
        colorScheme={rewards.FORM.colorScheme}
      >
        Fill form
      </RewardCardButton>
    )

  if (isAdmin)
    return (
      <RewardCardButton
        as={Link}
        href={`/${urlName}/forms/${form?.id}/responses`}
        prefetch={false}
        rightIcon={<ArrowRight />}
      >
        View responses
      </RewardCardButton>
    )

  if (form.isEditable)
    return (
      <RewardCardButton
        as={Link}
        prefetch={false}
        href={`/${urlName}/forms/${form?.id}`}
        variant="outline"
      >
        View / edit response
      </RewardCardButton>
    )

  return (
    <RewardCardButton leftIcon={<Check />} isDisabled variant="outline">
      Already submitted
    </RewardCardButton>
  )
}
export default FormCardLinkButton
