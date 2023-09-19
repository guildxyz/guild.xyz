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
import { DiscordEvent } from "hooks/useDiscordEvents"
import EventImage from "./components/EventImage"
import EventInfo from "./components/EventInfo"
import JoinDiscordEventButton from "./components/JoinDiscordEventButton"

type Props = {
  event: DiscordEvent
  guildId: number
}

const DiscordEventCard = ({ event, guildId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { name, description, image, scheduledStartTimestamp, userCount, id } = event

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
                {name}
              </Heading>
              <EventInfo
                userCount={userCount}
                startDate={scheduledStartTimestamp}
                mb="4"
              />
              {description && (
                <Text fontSize="sm" noOfLines={2} mb="4">
                  {description}
                </Text>
              )}
              <LinkOverlay mt="auto">
                <JoinDiscordEventButton
                  eventName={name}
                  guildId={guildId}
                  userCount={userCount}
                  eventId={id}
                  size="sm"
                />
              </LinkOverlay>
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
          <ModalCloseButton zIndex="modal" />
          <ModalBody p="5 !important">
            <EventImage eventId={id} image={image} showFallback={false} mb="5" />
            <Heading
              fontSize={"xl"}
              fontFamily={"Dystopian"}
              fontWeight={"bold"}
              mb={3}
            >
              {name}
            </Heading>
            <EventInfo
              userCount={userCount}
              startDate={scheduledStartTimestamp}
              mb="5"
            />
            {description && (
              <Text fontSize={"sm"} flexGrow={1} mb="5">
                {description}
              </Text>
            )}
            <JoinDiscordEventButton
              eventName={name}
              guildId={guildId}
              userCount={userCount}
              eventId={id}
              w="full"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DiscordEventCard
