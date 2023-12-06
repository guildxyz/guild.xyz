import { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { useState } from "react"
import { GuildBase } from "types"
import { shuffleArray } from "utils/shuffleArray"

export const START_ZONE_ID = "source"
type DropzoneDict = Record<string, GuildBase | null>

const useDragAndDrop = (guilds) => {
  const [startZone, setStartZone] = useState<GuildBase[]>(shuffleArray(guilds))
  const [movingGuild, setMovingGuild] = useState<GuildBase | null>(null)

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

  const dragStart = (event: DragStartEvent) => {
    setMovingGuild(guilds.find((g) => g.id.toString() === event.active.id))
  }

  const dragEnd = (event: DragEndEvent) => {
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

  return {
    startZone,
    dropzones,
    movingGuild,
    dragStart,
    dragEnd,
  }
}

export default useDragAndDrop
