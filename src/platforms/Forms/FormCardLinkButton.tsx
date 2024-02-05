import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { GuildPlatform } from "types"

type Props = {
  platform: GuildPlatform
}

const FormCardLinkButton = ({ platform }: Props) => {
  const { urlName } = useGuild()
  const { data } = useForms()

  const formId = data?.find((form) => form.id === platform.platformGuildData?.formId)

  return (
    <LinkButton
      isLoading={!formId}
      href={`/${urlName}/forms/${formId}`}
      size="lg"
      w="full"
      colorScheme="GUILD"
    >
      Fill form
    </LinkButton>
  )
}
export default FormCardLinkButton
