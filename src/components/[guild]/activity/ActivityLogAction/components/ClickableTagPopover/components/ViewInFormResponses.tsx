import { ArrowSquareOut } from "@phosphor-icons/react/ArrowSquareOut"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useRouter } from "next/router"

type Props = {
  label: string
  formId: number
  guildId: number
  userId: number
}

const ViewInFormResponses = ({
  label,
  formId,
  guildId,
  userId,
}: Props): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild(guildId)

  return (
    <Button
      variant="ghost"
      leftIcon={<ArrowSquareOut />}
      size="sm"
      borderRadius={0}
      onClick={() =>
        router.push(`/${urlName}/forms/${formId}/responses?search=${userId}`)
      }
      justifyContent="start"
    >
      {label}
    </Button>
  )
}
export default ViewInFormResponses
