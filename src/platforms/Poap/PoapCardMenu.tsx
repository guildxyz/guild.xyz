import { MenuItem, useDisclosure } from "@chakra-ui/react"
import EditPoapModal from "components/[guild]/CreatePoap/components/PoapDataForm/EditPoapModal"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"

import { PencilSimple } from "phosphor-react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { GuildPoap } from "types"

type Props = {
  guildPoap: GuildPoap
}

const PoapCardMenu = ({ guildPoap }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { poap } = usePoap(guildPoap?.fancyId)

  if (!poap || !guildPoap) return null

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit POAP
        </MenuItem>
      </PlatformCardMenu>

      <EditPoapModal {...{ isOpen, onClose, guildPoap, poap }} />
    </>
  )
}

export default PoapCardMenu
