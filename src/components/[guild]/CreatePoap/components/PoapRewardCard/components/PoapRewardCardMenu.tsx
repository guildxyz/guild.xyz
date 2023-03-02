import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"

import { DotsThree, PencilSimple } from "phosphor-react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { GuildPoap } from "types"
import EditPoapModal from "../../PoapDataForm/EditPoapModal"

type Props = {
  guildPoap: GuildPoap
}

const PoapRewardCardMenu = ({ guildPoap }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { poap } = usePoap(guildPoap?.fancyId)

  if (!poap || !guildPoap) return null

  return (
    <>
      <Menu placement="bottom-end" closeOnSelect={false}>
        <MenuButton
          as={IconButton}
          icon={<DotsThree />}
          aria-label="Menu"
          boxSize={8}
          minW={8}
          rounded="full"
          colorScheme="alpha"
        />

        <MenuList>
          <MenuItem icon={<PencilSimple />} onClick={onOpen}>
            Edit POAP
          </MenuItem>
        </MenuList>
      </Menu>

      <EditPoapModal {...{ isOpen, onClose, guildPoap, poap }} />
    </>
  )
}

export default PoapRewardCardMenu
