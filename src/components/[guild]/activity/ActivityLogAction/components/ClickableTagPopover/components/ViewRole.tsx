import { ArrowSquareOut } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useRouter } from "next/router"
import { useState } from "react"

type Props = {
  roleId: number
  page?: "guild" | "activity"
}

const ViewRole = ({ roleId, page = "guild" }: Props): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()
  const [hasClicked, setHasClicked] = useState(false)

  return (
    <Button
      variant="ghost"
      leftIcon={<ArrowSquareOut />}
      size="sm"
      borderRadius={0}
      onClick={() => {
        setHasClicked(true)
        router.push(
          page === "guild"
            ? `/${urlName}#role-${roleId}`
            : `/${urlName}/activity?roleId=${roleId}`
        )
      }}
      justifyContent="start"
      isLoading={hasClicked}
      loadingText="Redirecting"
    >
      {page === "guild" ? "View role" : "View activity"}
    </Button>
  )
}
export default ViewRole
