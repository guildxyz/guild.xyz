import {
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
  Tooltip,
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

const EligibleMembers = (): JSX.Element => {
  const { poapEventDetails } = usePoapEventDetails()
  const {
    voiceParticipants,
    isVoiceParticipantsLoading,
    latestFetch,
    mutateVoiceParticipants,
  } = useVoiceParticipants()

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
      <Button
        size="xs"
        borderRadius="md"
        isLoading={isVoiceParticipantsLoading}
        loadingText="Refreshing"
        leftIcon={<Icon as={Users} />}
        onClick={onOpen}
      >
        {`${eligibleMembers?.length ?? 0}/${
          voiceParticipants?.length ?? 0
        } eligible`}
      </Button>

      {!poapEventDetails?.voiceEventEndedAt && (
        <Tooltip label="Please wait" isDisabled={canFetch} shouldWrapChildren>
          <IconButton
            aria-label="Refresh eligible members"
            icon={<Icon as={ArrowsClockwise} />}
            size="xs"
            borderRadius="md"
            onClick={() => mutateVoiceParticipants()}
            isDisabled={!canFetch}
          />
        </Tooltip>
      )}

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
