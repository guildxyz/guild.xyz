import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import LinkMenuItem from "components/common/LinkMenuItem"
import { PiPencilSimple } from "react-icons/pi"
import { PiTable } from "react-icons/pi"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import EditFormModal from "./EditFormModal"

type Props = {
  platformGuildId: string
}

const FormCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { urlName, guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )
  const formId = guildPlatform?.platformGuildData?.formId

  const { form } = useGuildForm(formId)

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PiPencilSimple />} onClick={onOpen}>
          Edit form
        </MenuItem>

        <LinkMenuItem
          href={`/${urlName}/forms/${formId}/responses`}
          icon={<PiTable />}
        >
          View responses
        </LinkMenuItem>

        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      {!!form && <EditFormModal isOpen={isOpen} onClose={onClose} form={form} />}
    </>
  )
}

export default FormCardMenu
