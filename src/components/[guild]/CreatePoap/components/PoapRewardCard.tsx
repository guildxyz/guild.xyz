import {
  Box,
  HStack,
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import RewardCard from "components/common/RewardCard"
import useClaimPoap from "components/[guild]/claim-poap/hooks/useClaimPoap"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"
import { PropsWithChildren } from "react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { GuildPoap, Rest } from "types"
import Distribution from "./Distribution"
import UploadMintLinks from "./UploadMintLinks"

type Props = {
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  poap: GuildPoap
} & Rest

const PoapRewardCard = ({
  poap: guildPoap,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const { account } = useWeb3React()
  const { poap } = usePoap(guildPoap?.fancyId)
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)
  const { image_url: image, name } = poap ?? {}
  const colorScheme = guildPoap.activated ? `purple` : `gray`
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
  const {
    isOpen: isMintModalOpen,
    onOpen: onMintModalOpen,
    onClose: onMintModalClose,
  } = useDisclosure()

  const {
    onSubmit: onClaimPoapSubmit,
    isLoading: isClaimPoapLoading,
    response: claimPoapResponse,
  } = useClaimPoap(poap, { onSuccess: onMintModalOpen })

  return (
    <>
      <RewardCard
        label={`POAP ${!guildPoap?.activated ? "- not active yet" : ""}`}
        title={name}
        description={
          <Tag mt="1">{`${poapLinks?.total - poapLinks?.claimed} available`}</Tag>
        }
        {...{ image, colorScheme, actionRow, cornerButton }}
        {...rest}
      >
        {!poapLinks?.total ? (
          <Button onClick={onLinkModalOpen}>Upload minting links</Button>
        ) : !guildPoap.activated ? (
          <Button onClick={onActivateModalOpen}>Activate</Button>
        ) : claimPoapResponse ? (
          <Button
            as={"a"}
            target={"_blank"}
            href={claimPoapResponse}
            rightIcon={<ArrowSquareOut />}
            colorScheme={colorScheme}
          >
            Go to minting page
          </Button>
        ) : (
          <Button
            colorScheme={colorScheme}
            onClick={onClaimPoapSubmit}
            isLoading={isClaimPoapLoading}
            loadingText="Getting link"
          >
            Mint POAP
          </Button>
        )}
      </RewardCard>
      <Modal isOpen={isLinkModalOpen} onClose={onLinkModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Upload POAP minting links</ModalHeader>
          <ModalBody>
            <UploadMintLinks poapId={poap?.id} onSuccess={onLinkModalClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
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
      <Modal isOpen={isMintModalOpen} onClose={onMintModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Mint POAP</ModalHeader>
          <ModalBody>
            <HStack spacing={0}>
              <Icon as={CheckCircle} color="green.500" boxSize="16" weight="light" />
              <Box pl="6" w="calc(100% - var(--chakra-sizes-16))">
                <Text>{`You can mint your POAP on the link below:`}</Text>
                <Link
                  mt={2}
                  maxW="full"
                  href={`${claimPoapResponse}?address=${account}`}
                  colorScheme="blue"
                  isExternal
                  fontWeight="semibold"
                >
                  <Text as="span" noOfLines={1}>
                    {`${claimPoapResponse}?address=${account}`}
                  </Text>
                  <Icon as={ArrowSquareOut} />
                </Link>
              </Box>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PoapRewardCard
