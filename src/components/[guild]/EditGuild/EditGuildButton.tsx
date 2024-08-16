import { ButtonProps, IconButton, Tooltip } from "@chakra-ui/react"
import { SlidersHorizontal } from "@phosphor-icons/react"
import { useRouter } from "next/router"
import useGuild from "../hooks/useGuild"

const EditGuildButton = (props: ButtonProps): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()

  return (
    <Tooltip label="Admin dashboard" hasArrow>
      <IconButton
        icon={<SlidersHorizontal />}
        aria-label="Edit Guild"
        onClick={() => router.push(`/${urlName}/dashboard`)}
        {...props}
      />
    </Tooltip>
  )
}

export default EditGuildButton
