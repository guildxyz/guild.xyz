import { Item } from "../types"

const GRID_W = 6

const move = (items: Item[], item: Item, moveTo: Item["desktop"]) => {
  item.desktop = moveTo

  // const itemIndex = items.map((_item) => _item.id).findIndex((id) => id === item.id)

  for (let i = 0; i < items.length; i++) {
    const otherItem = items[i]

    if (checkCollision(item, otherItem)) {
      move(
        items,
        otherItem,
        handleWrap({
          ...otherItem.desktop,
          x: item.desktop.x + item.desktop.width,
        })
      )
    }
  }

  items = sortItems(items)
}

const checkCollision = (item1: Item, item2: Item) => {
  if (item1.id === item2.id) return false
  if (item1.desktop.x + item1.desktop.width <= item2.desktop.x) return false // left
  if (item1.desktop.x >= item2.desktop.x + item2.desktop.width) return false // right
  if (
    item1.desktop.y +
      (typeof item1.desktop.height === "number" ? item1.desktop.height : 1) <=
    item2.desktop.y
  )
    return false // above
  if (
    item1.desktop.y >=
    item2.desktop.y +
      (typeof item2.desktop.height === "number" ? item2.desktop.height : 1)
  )
    return false // below
  return true
}

export const handleWrap = (position: Item["desktop"]) => {
  if (position.x + position.width - 1 <= GRID_W) return position

  if ((position.x % 6) + position.width > GRID_W)
    return {
      ...position,
      x: 1,
      y:
        position.y + (typeof position.height === "number" ? position.height : 1) - 1,
    }

  return {
    ...position,
    x: Math.max(position.x % 6, 1),
    y: position.y + 1,
  }
}

const sortItems = (items: Item[]) =>
  items.sort((item1, item2) =>
    item1.desktop.y === item2.desktop.y
      ? item1.desktop.x - item2.desktop.x
      : item1.desktop.y - item2.desktop.y
  )
export default move
