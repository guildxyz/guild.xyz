import { Alert, AlertIcon, Divider, Heading, VStack } from "@chakra-ui/react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import React, { useState } from "react"
import { GuildBase } from "types"
import { shuffleArray } from "utils/shuffleArray"
import Draggable from "./assign-logos/Draggable"
import GuildCardWithDropzone from "./assign-logos/GuildCardWithDropzone"
import SourceDropzone from "./assign-logos/SourceDropzone"

export const START_ZONE_ID = "source"

type DropzoneDict = Record<string, GuildBase | null>

const AssignLogos = ({ guilds }: { guilds: GuildBase[] }) => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const avatarSize = 90

  const [movingGuild, setMovingGuild] = useState<GuildBase | null>(null)

  const [startZone, setStartZone] = useState<GuildBase[]>(shuffleArray(guilds))
  const initialDropzones = Object.fromEntries(
    guilds.map((guild) => [guild.id, null])
  )
  const [dropzones, setDropzones] = useState<DropzoneDict>(initialDropzones)

  const addToStartZone = (guild) => {
    setStartZone((prev) => [...prev, guild])
  }

  const removeFromStartZone = (guildId) => {
    setStartZone((prev) => prev.filter((g) => g.id !== guildId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (isAnswerSubmitted) return
    setMovingGuild(guilds.find((g) => g.id.toString() === event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (isAnswerSubmitted) return
    const { over } = event

    if (!over || !movingGuild) {
      setMovingGuild(null)
      return
    }

    const sourceZoneId = findSourceZoneId(movingGuild)
    const targetZoneId = over.id

    if (!isMoveAllowed(sourceZoneId, targetZoneId)) {
      setMovingGuild(null)
      return
    }

    updateDropzones(sourceZoneId, targetZoneId)
    updateStartZone(sourceZoneId, targetZoneId)

    setMovingGuild(null)
  }

  const updateDropzones = (sourceZoneId, targetZoneId) => {
    const updatedDropzones = { ...dropzones }

    if (targetZoneId !== START_ZONE_ID) {
      updatedDropzones[targetZoneId] = guilds.find(
        (guild) => guild.id === movingGuild.id
      )
    }

    if (sourceZoneId !== START_ZONE_ID) {
      updatedDropzones[sourceZoneId] = null
    }

    setDropzones(updatedDropzones)
  }

  const updateStartZone = (sourceZoneId, targetZoneId) => {
    if (targetZoneId === START_ZONE_ID) {
      addToStartZone(movingGuild)
    }
    if (sourceZoneId === START_ZONE_ID) {
      removeFromStartZone(movingGuild.id)
    }
  }

  const isMoveAllowed = (sourceZoneId, targetZoneId) => {
    if (sourceZoneId === targetZoneId) return false

    if (targetZoneId !== START_ZONE_ID && dropzones[targetZoneId]) return false

    return true
  }

  const findSourceZoneId = (guild: GuildBase): string | number | null => {
    const isInStartZone = startZone.some((g) => g.id === guild.id)
    if (isInStartZone) return START_ZONE_ID

    const sourceDropzone = Object.entries(dropzones).find(
      ([_, dzGuild]) => dzGuild?.id === guild.id
    )
    return sourceDropzone ? sourceDropzone[0] : null
  }

  const renderDraggableAvatar = (guild: GuildBase) => {
    if (!guild) return
    return (
      <React.Fragment key={guild.id}>
        {guild.id != movingGuild?.id && (
          <Draggable id={`${guild.id}`}>
            <GuildLogo w={avatarSize} h={avatarSize} imageUrl={guild.imageUrl} />
          </Draggable>
        )}
      </React.Fragment>
    )
  }

  const isAnswerCorrect = Object.entries(dropzones).every(
    ([zoneId, guild]) => `${guild?.id}` === zoneId
  )
  const isLogoCorrectForGuild = (guild: GuildBase) =>
    dropzones[guild.id]?.id === guild?.id

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
          {!isAnswerSubmitted && (
            <>
              <SourceDropzone id={START_ZONE_ID} size={avatarSize}>
                {startZone.map((guild) => renderDraggableAvatar(guild))}
              </SourceDropzone>
            </>
          )}

          <DragOverlay>
            {movingGuild && !isAnswerSubmitted ? (
              <GuildLogo w={avatarSize} h={avatarSize} />
            ) : null}
          </DragOverlay>

          {guilds.map((guild) => (
            <GuildCardWithDropzone
              key={guild.id}
              guild={guild}
              avatarSize={avatarSize}
              isAnswerSubmitted={isAnswerSubmitted}
              isLogoCorrect={isLogoCorrectForGuild(guild)}
            >
              {renderDraggableAvatar(dropzones[`${guild.id}`])}
            </GuildCardWithDropzone>
          ))}
        </DndContext>

        <Divider />

        {isAnswerSubmitted && (
          <Alert
            status={isAnswerCorrect ? "success" : "warning"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <AlertIcon />{" "}
            {isAnswerCorrect ? "Your answer is correct!" : "Wrong answer!"}
          </Alert>
        )}

        {isAnswerSubmitted && (
          <Button colorScheme="green" w="100%">
            Continue
          </Button>
        )}
        {!isAnswerSubmitted && (
          <Button
            colorScheme="green"
            w="100%"
            onClick={() => setIsAnswerSubmitted(true)}
          >
            Submit
          </Button>
        )}
      </VStack>
    </>
  )
}

export default AssignLogos
