import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import { PencilSimple } from "phosphor-react"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import EditFormModal from "./EditFormModal"

type Props = {
  platformGuildId: string
}

const FormCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { data: forms } = useForms()
  const form = forms?.find((f) => f.id === guildPlatform?.platformGuildData?.formId)

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit form
        </MenuItem>
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      {!!form && <EditFormModal isOpen={isOpen} onClose={onClose} form={form} />}
    </>
  )
}

export default FormCardMenu
