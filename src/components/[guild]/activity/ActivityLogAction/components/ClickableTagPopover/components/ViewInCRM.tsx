import Button from "components/common/Button"
import { useActivityLog } from "components/[guild]/activity/ActivityLogContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { ArrowSquareOut } from "phosphor-react"

type Props = {
  label: string
  queryKey: string
  queryValue: string
}

const ViewInCRM = ({ label, queryKey, queryValue }: Props): JSX.Element => {
  const router = useRouter()
  const { urlName, featureFlags } = useGuild()
  const isCRMDisabled = !featureFlags?.includes("CRM")
  const { isUserActivityLog } = useActivityLog()

  if (isUserActivityLog) return null

  return (
    <Button
      variant="ghost"
      leftIcon={<ArrowSquareOut />}
      size="sm"
      borderRadius={0}
      isDisabled={isCRMDisabled}
      onClick={() =>
        router.push(`/${urlName}/members?${`${queryKey}=${queryValue}`}`)
      }
      justifyContent="start"
    >
      {label}
    </Button>
  )
}
export default ViewInCRM
