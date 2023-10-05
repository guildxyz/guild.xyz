import {
  Grid,
  GridItem,
  Heading,
  LinkBox,
  LinkOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Modal } from "components/common/Modal"
import { GuildEvent } from "hooks/useGuildEvents"
import EventImage from "./components/EventImage"
import EventInfo from "./components/EventInfo"
import JoinEventButton from "./components/JoinEventButton"

type Props = {
  event: GuildEvent
  guildId: number
}

const EventCard = ({ event, guildId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { title, description, start, memberCount } = event

  return (
    <>
      <LinkBox onClick={onOpen} cursor="pointer" w="full">
        <Card w="full" p={5}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: 3, md: 5 }}
          >
            <GridItem
              order={{ base: 2, md: 1 }}
              display="flex"
              flexDirection={"column"}
            >
              <Heading
                fontSize={"xl"}
                fontFamily={"Dystopian"}
                fontWeight={"bold"}
                mb={3}
              >
                {title}
              </Heading>
              <EventInfo userCount={memberCount} startDate={start} mb="4" />
              {description && (
                <Text fontSize="sm" noOfLines={2} mb="4">
                  {description}
                </Text>
              )}
              <LinkOverlay mt="auto">
                <JoinEventButton
                  eventName={title}
                  eventType={event.eventType}
                  guildId={guildId}
                  userCount={memberCount}
                  url={event.url}
                  size="sm"
                />
              </LinkOverlay>
            </GridItem>
            <GridItem order={{ base: 1, md: 2 }}>
              <EventImage
                url={event.image}
                altText={`${event.title} -  event cover`}
              />
            </GridItem>
          </Grid>
        </Card>
      </LinkBox>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton zIndex="modal" />
          <ModalBody p="5 !important">
            <EventImage
              url={event.image}
              showFallback={false}
              altText={`${event.title} -  event cover`}
              mb="5"
            />
            <Heading
              fontSize={"xl"}
              fontFamily={"Dystopian"}
              fontWeight={"bold"}
              mb={3}
            >
              {title}
            </Heading>
            <EventInfo userCount={memberCount} startDate={start} mb="5" />
            {description && (
              <Text fontSize={"sm"} flexGrow={1} mb="5">
                {description}
              </Text>
            )}
            <JoinEventButton
              eventName={title}
              guildId={guildId}
              eventType={event.eventType}
              userCount={memberCount}
              url={event.url}
              w="full"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EventCard
