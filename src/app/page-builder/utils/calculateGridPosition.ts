import { Item } from "../types"

const BASE_SIZE = 145

const calculateGridPosition = (
  relativeMouseX: number,
  relativeMouseY: number,
  itemPosition: Item["desktop"]
) => {
  const x = Math.min(
    Math.floor(relativeMouseX / BASE_SIZE) + 1,
    6 - (itemPosition.width - 1)
  )
  const y = Math.floor(relativeMouseY / BASE_SIZE) + 1

  return { x, y }
}

export default calculateGridPosition
