import {
  Box,
  Collapse,
  Heading,
  LinkBox,
  LinkOverlay,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Modal } from "components/common/Modal"
import { DiscordEvent } from "hooks/useDiscordEvents"
import DiscordEventModal from "./DiscordEventModal"
import EventImage from "./EventImage"
import EventInfo from "./EventInfo"
import JoinDiscordEventButton from "./JoinDiscordEventButton"

type Props = {
  event: DiscordEvent
  guildId: number
}

const DiscordEventCard = ({ event, guildId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { name, description, image, scheduledStartTimestamp, userCount, id } = event

  return (
    <>
      <LinkBox onClick={onOpen} cursor="pointer">
        <Card
          flexDirection={{ base: "column-reverse", md: "row" }}
          gap={5}
          flexGrow="1"
          p={5}
        >
          <VStack alignItems={"flex-start"} flex={"1"} gap={4}>
            <Heading
              fontSize={"xl"}
              fontFamily={"Dystopian"}
              fontWeight={"bold"}
              mb={-1}
            >
              {name}
            </Heading>
            <EventInfo userCount={userCount} startDate={scheduledStartTimestamp} />
            {description && (
              <Box>
                <Collapse startingHeight={"40px"} in={false}>
                  <Text fontSize={"sm"} flexGrow={1}>
                    {description}
                  </Text>
                </Collapse>
              </Box>
            )}
            <LinkOverlay>
              <JoinDiscordEventButton
                eventName={name}
                guildId={guildId}
                userCount={userCount}
                eventId={id}
              />
            </LinkOverlay>
          </VStack>
          <EventImage eventId={id} image={image} />
        </Card>
      </LinkBox>

      <Modal colorScheme={"dark"} isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <DiscordEventModal event={event} guildId={guildId} />
        </ModalContent>
      </Modal>
    </>
  )
}

export default DiscordEventCard
