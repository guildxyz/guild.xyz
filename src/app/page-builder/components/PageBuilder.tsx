"use client"

import { EASINGS, Grid, GridItem, Stack } from "@chakra-ui/react"
import ItemWrapper from "app/page-builder/components/ItemWrapper"
import move from "app/page-builder/utils/pageBuilder"
import Card from "components/common/Card"
import { AnimatePresence, LayoutGroup, PanInfo, motion } from "framer-motion"
import { useRef, useState } from "react"
import { Item } from "../types"
import calculateGridPosition from "../utils/calculateGridPosition"
import Role from "./Role"

const initialItems: Item[] = [
  {
    id: "0",
    desktop: {
      x: 1,
      y: 1,
      width: 2,
      height: 2,
    },
    type: "ROLE",
    data: {
      guildId: 1985,
      roleId: 1900,
    },
  },
  {
    id: "1",
    desktop: {
      x: 3,
      y: 1,
      width: 1,
      height: 1,
    },

    type: "ROLE",
    data: {
      guildId: 1985,
      roleId: 1900,
    },
  },
  {
    id: "2",
    desktop: {
      x: 3,
      y: 2,
      width: 2,
      height: 1,
    },

    type: "ROLE",
    data: {
      guildId: 1985,
      roleId: 1900,
    },
  },
  {
    id: "3",
    desktop: {
      x: 1,
      y: 3,
      width: 3,
      height: 2,
    },

    type: "ROLE",
    data: {
      guildId: 1985,
      roleId: 1900,
    },
  },
  {
    id: "4",
    desktop: {
      x: 4,
      y: 3,
      width: 1,
      height: 2,
    },

    type: "ROLE",
    data: {
      guildId: 1985,
      roleId: 1900,
    },
  },
]

export const BASE_SIZE = 145
export const PADDING = 14

const MotionCard = motion(Card)

const PageBuilder = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const elementToXY = (element: HTMLDivElement, itemPosition: Item["desktop"]) => {
    if (!containerRef.current) return

    const { left: elLeft, top: elTop } = element.getBoundingClientRect()

    const elXCenter = elLeft + BASE_SIZE / 2 - (itemPosition.x - 1) * PADDING
    const elYCenter = elTop + BASE_SIZE / 2 - (itemPosition.y - 1) * PADDING

    const { left, top } = containerRef.current.getBoundingClientRect()

    const x = Math.max(elXCenter - left, 0)
    const y = Math.max(elYCenter - top, 0)

    return calculateGridPosition(x, y, itemPosition)
  }

  const [placeholderPosition, setPlaceholderPosition] = useState<
    Item["desktop"] | null
  >(null)

  const [items, setItems] = useState<Item[]>(initialItems)

  const onDrag: (
    itemId: string,
    event: MouseEvent | TouchEvent | PointerEvent,
    panInfo: PanInfo
  ) => void = (itemId, event, panInfo) => {
    if (
      !containerRef.current ||
      (Math.abs(panInfo.delta.x) < 1 && Math.abs(panInfo.delta.y) < 1)
    )
      return

    const itemsClone = structuredClone(items)
    const itemToMove = itemsClone.find((item) => item.id === itemId)

    if (!itemToMove) return

    if (!placeholderPosition) setPlaceholderPosition(itemToMove.desktop)

    const newPosition = elementToXY(event.target as HTMLDivElement, {
      ...itemToMove.desktop,
    })

    // Early return, so we don't need to calculate anything for the grid & we also don't need to set the placeholder state
    if (
      newPosition?.x === itemToMove.desktop.x &&
      newPosition?.y === itemToMove.desktop.y
    )
      return

    move(itemsClone, itemToMove, {
      ...itemToMove.desktop,
      ...newPosition,
    })

    // We should find a more clever solution for this, because we can pretty easily get a "maximum call stack depth exceeded" because of setState
    if (
      items.some((item) => {
        const updatedItem = itemsClone.find((_item) => _item.id === item.id)
        const isUpdated = Object.keys(updatedItem?.desktop ?? {})
          .map((key) => {
            if (item.desktop[key] !== updatedItem?.desktop[key]) return true
          })
          .some(Boolean)

        return isUpdated
      })
    ) {
      setPlaceholderPosition({
        ...itemToMove.desktop,
        ...newPosition,
      })
      setItems(itemsClone)
    }
  }

  return (
    <Stack spacing={4}>
      {/* <Button
        leftIcon={<Plus />}
        maxW="max-content"
        onClick={() =>
          setItems((prevItems) => {
            const id = uuidv7()
            if (!prevItems?.length)
              return [
                {
                  id,
                  type: "ROLE",
                  data: {},
                  desktop: {
                    x: 1,
                    y: 1,
                    width: 1,
                    height: 1,
                  },
                } satisfies Item,
              ]

            // It's safe to select the last item, because the array is sorted properly
            const lastItem = prevItems.at(-1)

            return [
              ...prevItems,
              {
                id,
                type: "ROLE",
                data: {},
                desktop: handleWrap({
                  width: 1,
                  height: 1,
                  x: lastItem.desktop.x + lastItem.desktop.width,
                  y: lastItem.desktop.y,
                }),
              } satisfies Item,
            ]
          })
        }
      >
        Add card
      </Button> */}

      <Grid
        templateColumns="repeat(6, 1fr)"
        gridAutoRows="minmax(145px, auto)"
        gap="0.875rem"
        ref={containerRef}
      >
        <LayoutGroup>
          <AnimatePresence>
            {placeholderPosition && (
              <GridItem
                key={`placeholer-${placeholderPosition.x}-${placeholderPosition.y}`}
                as={MotionCard}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.1, ease: EASINGS.easeOut },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.1, ease: EASINGS.easeIn },
                }}
                layout
                background="transparent"
                border={2}
                shadow="none"
                borderColor="whiteAlpha.300"
                borderStyle="dashed"
                gridColumnStart={placeholderPosition.x}
                gridRowStart={placeholderPosition.y}
                colSpan={
                  typeof placeholderPosition.width === "number"
                    ? placeholderPosition.width
                    : 6
                }
                rowSpan={
                  typeof placeholderPosition.height === "number"
                    ? placeholderPosition.height
                    : 1
                }
              />
            )}

            {items?.map((item) => (
              <ItemWrapper
                key={item.id}
                item={item}
                onDrag={(event, panInfo) => onDrag(item.id, event, panInfo)}
                onDragEnd={() => setPlaceholderPosition(null)}
                onResize={(width, height) => {
                  const itemsClone = structuredClone(items)
                  const itemToResize = itemsClone.find(
                    (_item) => _item.id === item.id
                  )
                  move(itemsClone, itemToResize, {
                    ...item.desktop,
                    width,
                    height,
                  })
                  setItems(itemsClone)
                }}
                onRemove={() =>
                  setItems((prevItems) =>
                    prevItems.filter(({ id }) => id !== item.id)
                  )
                }
              >
                <Role data={item.data} desktop={item.desktop} />
              </ItemWrapper>
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </Grid>
    </Stack>
  )
}

export default PageBuilder
