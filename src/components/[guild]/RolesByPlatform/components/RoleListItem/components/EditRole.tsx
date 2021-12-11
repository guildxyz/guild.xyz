import { Icon, IconButton } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { PencilSimple } from "phosphor-react"
import { Role } from "types"

type Props = {
  roleData: Role
}

// Calling it "EditRole" & dynamically importing it to the guild page because we'll probably have much more stuff (e.g. role edit form) in this component
const EditRole = ({ roleData }: Props): JSX.Element => {
  const router = useRouter()

  return (
    <IconButton
      icon={<Icon as={PencilSimple} />}
      size="sm"
      rounded="full"
      aria-label="Edit role"
      onClick={() => router.push(`/${router.query.guild}/edit/${roleData.id}`)}
    />
  )
}

export default EditRole
