import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { ArrowSquareOut } from "phosphor-react"

type Props = {
  roleId: number
  page?: "guild" | "activity"
}

const ViewRole = ({ roleId, page = "guild" }: Props): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()

  return (
    <Button
      variant="ghost"
      leftIcon={<ArrowSquareOut />}
      size="sm"
      borderRadius={0}
      onClick={() =>
        router.push(
          page === "guild"
            ? `/${urlName}#role-${roleId}`
            : `/${urlName}/activity?roleId=${roleId}`
        )
      }
      justifyContent="start"
    >
      {page === "guild" ? "View role" : "View role in activity log"}
    </Button>
  )
}
export default ViewRole
