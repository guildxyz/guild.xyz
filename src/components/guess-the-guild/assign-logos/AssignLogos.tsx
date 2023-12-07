import { Divider, Heading, VStack } from "@chakra-ui/react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import React, { useMemo, useState } from "react"
import { GuildBase } from "types"
import ResultAlert from "../components/ResultAlert"
import { GameModeProps } from "../guess-the-guild-types"
import Draggable from "./components/Draggable"
import GuildCardWithDropzone from "./components/GuildCardWithDropzone"
import SourceDropzone from "./components/SourceDropzone"
import useDragAndDrop, { START_ZONE_ID } from "./hooks/useDragAndDrop"

const AssignLogos = ({ guilds, onNext, onExit, onCorrect }: GameModeProps) => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const avatarSize = { base: "60px", sm: "70px", md: "80px" }

  const { startZone, dropzones, movingGuild, dragStart, dragEnd } =
    useDragAndDrop(guilds)

  const handleDragStart = (event: DragStartEvent) => {
    if (isAnswerSubmitted) return
    dragStart(event)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (isAnswerSubmitted) return
    dragEnd(event)
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

  const canSubmit = useMemo(() => {
    for (const key of Object.keys(dropzones)) {
      if (key !== "source" && dropzones[key] === null) {
        return false
      }
    }
    return true
  }, [dropzones])

  const handleSubmit = () => {
    setIsAnswerSubmitted(true)
    if (isAnswerCorrect) onCorrect()
  }

  const liftUpAnimation = `
      @keyframes liftUp {
        from {
          transform: scale(1.0);
        }
        to {
          transform: scale(1.1);
        }
      }`

  return (
    <>
      <style>{liftUpAnimation}</style>
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
              <GuildLogo
                w={avatarSize}
                h={avatarSize}
                imageUrl={movingGuild?.imageUrl}
                animation={"liftUp 0.3s ease-in-out"}
                transform={"scale(1.1)"}
                boxShadow={"lg"}
              />
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

        {isAnswerSubmitted && <ResultAlert isAnswerCorrect={isAnswerCorrect} />}

        {!isAnswerSubmitted && (
          <Button
            colorScheme="green"
            w="100%"
            isDisabled={!canSubmit}
            onClick={handleSubmit}
            data-test="submit"
          >
            Submit
          </Button>
        )}

        {isAnswerSubmitted && isAnswerCorrect && (
          <Button colorScheme="green" w="100%" onClick={onNext}>
            Continue
          </Button>
        )}

        {isAnswerSubmitted && !isAnswerCorrect && (
          <Button colorScheme="green" w="100%" onClick={onExit}>
            End Game
          </Button>
        )}
      </VStack>
    </>
  )
}

export default AssignLogos
