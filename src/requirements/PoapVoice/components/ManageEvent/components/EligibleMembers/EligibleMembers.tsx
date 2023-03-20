import {
  ButtonGroup,
  Divider,
  Flex,
  Icon,
  IconButton,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { ArrowsClockwise, Users } from "phosphor-react"
import { useEffect, useState } from "react"
import { FixedSizeList } from "react-window"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import useVoiceParticipants from "./hooks/useVoiceParticipants"

const EligibleMembers = ({ poapId }): JSX.Element => {
  const { poapEventDetails } = usePoapEventDetails(poapId)
  const {
    voiceParticipants,
    isVoiceParticipantsLoading,
    latestFetch,
    mutateVoiceParticipants,
  } = useVoiceParticipants(poapId)

  const [canFetch, setCanFetch] = useState(false)

  useEffect(() => {
    if (!poapEventDetails?.voiceEventStartedAt) return

    let interval

    if (latestFetch)
      interval = setInterval(
        () => setCanFetch(Date.now() - latestFetch > 15000),
        1000
      )

    return () => {
      clearInterval(interval)
    }
  }, [poapEventDetails, latestFetch])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const eligibleMembers = voiceParticipants?.filter((p) => p.isEligible) ?? []

  const Row = ({ index, style }) => (
    <ListItem style={style} fontSize={{ base: "md" }} ml="1em" pr="1em">
      {eligibleMembers[index].discordTag}
    </ListItem>
  )

  return (
    <>
      <ButtonGroup size="xs" isAttached>
        <Button
          isLoading={isVoiceParticipantsLoading}
          borderRadius="md"
          loadingText="Refreshing"
          leftIcon={<Icon as={Users} />}
          onClick={onOpen}
        >
          {`${eligibleMembers?.length ?? 0}/${
            voiceParticipants?.length ?? 0
          } eligible`}
        </Button>
        <Divider orientation="vertical" />
        {!poapEventDetails?.voiceEventEndedAt && (
          <IconButton
            borderRadius="md"
            aria-label="Refresh eligible members"
            icon={<Icon as={ArrowsClockwise} />}
            onClick={() => mutateVoiceParticipants()}
            isDisabled={!canFetch}
          />
        )}
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eligible members</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isVoiceParticipantsLoading ? (
              <Flex justifyContent="center">
                <Spinner />
              </Flex>
            ) : eligibleMembers?.length > 0 ? (
              <UnorderedList ml="2">
                <FixedSizeList
                  height={350}
                  itemCount={eligibleMembers.length}
                  itemSize={25}
                  className="custom-scrollbar"
                  style={{
                    overflowX: "hidden",
                  }}
                >
                  {Row}
                </FixedSizeList>
              </UnorderedList>
            ) : (
              <Text>There are no eligible members.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EligibleMembers
