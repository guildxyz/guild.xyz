import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import RewardCard from "components/common/RewardCard"
import { PropsWithChildren } from "react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { GuildPoap, Rest } from "types"
import useMintPoapButton, { MintModal } from "../hooks/useMintPoapButton"
import Distribution from "./Distribution"
import UploadMintLinks from "./UploadMintLinks"

type Props = {
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  guildPoap: GuildPoap
} & Rest

const PoapRewardCard = ({
  guildPoap,
  actionRow,
  cornerButton,
  ...rest
}: PropsWithChildren<Props>) => {
  const { isAdmin } = useGuildPermission()

  const { poap } = usePoap(guildPoap?.fancyId)
  const { poapLinks } = usePoapLinks(poap?.id)
  const { image_url: image, name } = poap ?? {}

  const {
    isOpen: isLinkModalOpen,
    onOpen: onLinkModalOpen,
    onClose: onLinkModalClose,
  } = useDisclosure()
  const {
    isOpen: isActivateModalOpen,
    onOpen: onActivateModalOpen,
    onClose: onActivateModalClose,
  } = useDisclosure()

  const { data } = useUserPoapEligibility(guildPoap?.poapIdentifier)

  const { buttonProps, modalProps } = useMintPoapButton(poap?.id)

  const availableLinks = poapLinks?.total - poapLinks?.claimed

  if (
    (!data.access ||
      !guildPoap.activated ||
      (!availableLinks && !modalProps.response)) &&
    !isAdmin
  )
    return null

  const colorScheme = guildPoap.activated ? `purple` : `gray`

  return (
    <>
      <RewardCard
        label={`POAP ${!guildPoap?.activated ? "- not active yet" : ""}`}
        title={name}
        description={
          !!poapLinks && (
            <Tag mt="1">{`${availableLinks}/${poapLinks?.total} available`}</Tag>
          )
        }
        borderStyle={!guildPoap?.activated && "dashed"}
        {...{ image, colorScheme, actionRow, cornerButton }}
        {...rest}
      >
        {!actionRow &&
          (!poapLinks?.total ? (
            <Button onClick={onLinkModalOpen}>Upload minting links</Button>
          ) : !guildPoap.activated ? (
            <Button onClick={onActivateModalOpen}>Activate</Button>
          ) : (
            <Button colorScheme="purple" {...buttonProps}>
              Mint POAP
            </Button>
          ))}
      </RewardCard>
      {!poapLinks?.total ? (
        <Modal isOpen={isLinkModalOpen} onClose={onLinkModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Upload POAP minting links</ModalHeader>
            <ModalBody>
              <UploadMintLinks poapId={poap?.id} onSuccess={onLinkModalClose}>
                <Text>
                  Uploading the links won't activate your POAP yet, you'll be able to
                  do it when you want
                </Text>
              </UploadMintLinks>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <MintModal {...modalProps} />
      )}
      {!guildPoap.activated && (
        <Modal isOpen={isActivateModalOpen} onClose={onActivateModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Activate POAP</ModalHeader>
            <ModalBody>
              <Distribution
                guildPoap={guildPoap}
                poap={poap}
                onSuccess={onActivateModalClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default PoapRewardCard
