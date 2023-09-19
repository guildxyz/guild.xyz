import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { ArrowSquareOut } from "phosphor-react"

type Props = {
  roleId: number
}

const ViewRole = ({ roleId }: Props): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()

  return (
    <Button
      variant="ghost"
      leftIcon={<ArrowSquareOut />}
      size="sm"
      borderRadius={0}
      onClick={() => router.push(`/${urlName}#role-${roleId}`)}
      justifyContent="start"
    >
      View role
    </Button>
  )
}
export default ViewRole
