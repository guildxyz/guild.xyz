import {
  MenuItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import EditPoapModal from "components/[guild]/CreatePoap/components/PoapDataForm/EditPoapModal"
import UploadMintLinks from "components/[guild]/CreatePoap/components/UploadMintLinks"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import { PencilSimple, UploadSimple } from "phosphor-react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { GuildPoap } from "types"
import DeactivatePoapMenuItem from "./DeactivatePoapMenuItem"

type Props = {
  guildPoap: GuildPoap
}

const PoapCardMenu = ({ guildPoap }: Props): JSX.Element => {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()
  const {
    isOpen: isLinkModalOpen,
    onOpen: onLinkModalOpen,
    onClose: onLinkModalClose,
  } = useDisclosure()
  const { poap } = usePoap(guildPoap?.fancyId)
  const { poapLinks } = usePoapLinks(guildPoap?.poapIdentifier)

  if (!poap || !guildPoap) return null

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onEditOpen}>
          Edit POAP
        </MenuItem>
        {!!poapLinks?.total && (
          <MenuItem icon={<UploadSimple />} onClick={onLinkModalOpen}>
            Upload more mint links
          </MenuItem>
        )}
        {guildPoap.activated && <DeactivatePoapMenuItem guildPoap={guildPoap} />}
      </PlatformCardMenu>

      <EditPoapModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        {...{ guildPoap, poap }}
      />
      {!!poapLinks?.total && (
        <Modal isOpen={isLinkModalOpen} onClose={onLinkModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Upload POAP minting links</ModalHeader>
            <ModalBody>
              <UploadMintLinks
                poapId={poap?.id}
                onSuccess={onLinkModalClose}
              ></UploadMintLinks>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default PoapCardMenu
