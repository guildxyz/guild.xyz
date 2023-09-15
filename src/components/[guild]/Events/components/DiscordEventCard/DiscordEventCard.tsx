import {
  Grid,
  GridItem,
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
        <Card w="full" p={5}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: 3, md: 5 }}
          >
            <GridItem order={{ base: 2, md: 1 }}>
              <VStack alignItems="flex-start" gap={4}>
                <Heading
                  fontSize={"xl"}
                  fontFamily={"Dystopian"}
                  fontWeight={"bold"}
                  mb={-1}
                >
                  {name}
                </Heading>
                <EventInfo
                  userCount={userCount}
                  startDate={scheduledStartTimestamp}
                />
                <Text fontSize="sm" noOfLines={2}>
                  {description}
                </Text>
                <LinkOverlay>
                  <JoinDiscordEventButton
                    eventName={name}
                    guildId={guildId}
                    userCount={userCount}
                    eventId={id}
                    size="sm"
                  />
                </LinkOverlay>
              </VStack>
            </GridItem>
            <GridItem order={{ base: 1, md: 2 }}>
              <EventImage eventId={id} image={image} />
            </GridItem>
          </Grid>
        </Card>
      </LinkBox>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <DiscordEventModal event={event} guildId={guildId} />
        </ModalContent>
      </Modal>
    </>
  )
}

export default DiscordEventCard
