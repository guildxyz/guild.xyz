import { ButtonProps, IconButton } from "@chakra-ui/react"
import { SlidersHorizontal } from "@phosphor-icons/react"
import { useRouter } from "next/router"
import useGuild from "../hooks/useGuild"

const EditGuildButton = (props: ButtonProps): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()

  return (
    <IconButton
      icon={<SlidersHorizontal />}
      aria-label="Edit Guild"
      onClick={() => router.push(`/${urlName}/dashboard`)}
      {...props}
    />
  )
}

export default EditGuildButton
