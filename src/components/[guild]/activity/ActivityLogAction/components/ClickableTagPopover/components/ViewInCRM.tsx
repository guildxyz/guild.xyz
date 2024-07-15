import { useActivityLog } from "components/[guild]/activity/ActivityLogContext"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useRouter } from "next/router"
import { PiArrowSquareOut } from "react-icons/pi"

type Props = {
  label: string
  queryKey: string
  queryValue: string
}

const ViewInCRM = ({ label, queryKey, queryValue }: Props): JSX.Element => {
  const router = useRouter()
  const { urlName, featureFlags } = useGuild()
  const isCRMDisabled = !featureFlags?.includes("CRM")
  const { activityLogType } = useActivityLog()

  if (activityLogType === "user") return null

  return (
    <Button
      variant="ghost"
      leftIcon={<PiArrowSquareOut />}
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
