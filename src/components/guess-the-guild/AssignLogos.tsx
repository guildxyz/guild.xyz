import {
  Box,
  Divider,
  HStack,
  Heading,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react"
import { DndContext, DragOverlay } from "@dnd-kit/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { Users } from "phosphor-react"
import { useState } from "react"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"
import Draggable from "./assign-logos/Draggable"
import SourceDropzone from "./assign-logos/SourceDropzone"

export const START_ZONE_ID = "source"

const AssignLogos = ({ guilds }: { guilds: GuildBase[] }) => {
  const bgColor = useColorModeValue("gray.100", "whiteAlpha.200")
  const borderColor = useColorModeValue("gray.300", "gray.500")

  const [submitted, setSubmitted] = useState(false)
  const avatarSize = 90

  const [movingGuild, setMovingGuild] = useState<GuildBase | null>(null)

  const handleDragStart = (event) => {
    setMovingGuild(guilds.find((g) => g.id.toString() === event.active.id))
  }

  const handleDragEnd = () => {
    setMovingGuild(null)
  }

  return (
    <>
      <VStack gap="5">
        <Heading
          as="h2"
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          textAlign="center"
          fontFamily="display"
        >
          Guess the guild by the logo!
        </Heading>

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SourceDropzone id={START_ZONE_ID} size={avatarSize}>
            <Draggable id="1">
              <GuildLogo />
            </Draggable>
          </SourceDropzone>

          <DragOverlay>{movingGuild ? <GuildLogo /> : null}</DragOverlay>
        </DndContext>

        <Card w="100%" py="5" px="5" background={bgColor}>
          <HStack gap="6">
            <Box
              h={avatarSize}
              w={avatarSize}
              minW={avatarSize}
              minH={avatarSize}
              rounded="100%"
              border="2px"
              borderStyle="dashed"
              borderColor={borderColor}
              p="1"
              boxSizing="content-box"
            ></Box>
            <VStack alignItems="start">
              <Text
                as="span"
                fontFamily="display"
                fontSize="lg"
                fontWeight="bold"
                letterSpacing="wide"
                maxW="full"
                noOfLines={1}
                wordBreak="break-all"
              >
                Guild Name
              </Text>
              <Wrap zIndex="1">
                <Tag as="li">
                  <TagLabel>{pluralize(1234, "role")}</TagLabel>
                </Tag>
                <Tag as="li">
                  <TagLeftIcon as={Users} />
                  <TagLabel>
                    {new Intl.NumberFormat("en", { notation: "compact" }).format(
                      1234
                    )}
                  </TagLabel>
                </Tag>
              </Wrap>
            </VStack>
          </HStack>
        </Card>

        <Divider />

        {submitted && (
          <Button colorScheme="green" w="100%">
            Continue
          </Button>
        )}
        {!submitted && (
          <Button colorScheme="green" w="100%" onClick={() => setSubmitted(true)}>
            Submit
          </Button>
        )}
      </VStack>
    </>
  )
}

export default AssignLogos
