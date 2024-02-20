import { Container, EASINGS, Grid, GridItem, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Item from "components/page-builder/Item"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { Plus } from "phosphor-react"
import { DragEventHandler, useRef, useState } from "react"
import move from "utils/page-builder"

export type ItemType = {
  id: number
  desktop: {
    x: number
    y: number
    width: 1 | 2 | 3 | 6
    height: 1 | 2 | 3 | "AUTO"
  }
  // mobile: {
  //   position: number
  //   width: 1 | 2
  //   height: 1 | 2 | "AUTO"
  // }
  type: "REWARD" | "ROLE" | "PAGE" | "SECTION"
  data: any
}

const initialItems: ItemType[] = [
  {
    id: 0,
    desktop: {
      x: 1,
      y: 1,
      width: 1,
      height: 1,
    },
    type: "ROLE",
    data: {},
  },
  {
    id: 1,
    desktop: {
      x: 2,
      y: 1,
      width: 1,
      height: 1,
    },

    type: "ROLE",
    data: {},
  },
  {
    id: 2,
    desktop: {
      x: 1,
      y: 2,
      width: 2,
      height: 1,
    },

    type: "ROLE",
    data: {},
  },
  {
    id: 3,
    desktop: {
      x: 1,
      y: 3,
      width: 1,
      height: 1,
    },

    type: "ROLE",
    data: {},
  },
]

export const BASE_SIZE = 145
export const PADDING = 14

const MotionCard = motion(Card)

const calculateGridPosition = (
  relativeMouseX: number,
  relativeMouseY: number,
  itemPosition: ItemType["desktop"]
) => {
  const itemWidthWithPadding = BASE_SIZE * itemPosition.width + PADDING
  const itemHeightWithPadding =
    BASE_SIZE * (typeof itemPosition.height === "number" ? itemPosition.height : 1) +
    PADDING

  const x = Math.min(Math.floor(relativeMouseX / itemWidthWithPadding) + 1, 6)
  const y = Math.floor(relativeMouseY / itemHeightWithPadding) + 1

  return { x, y }
}

const PageBuilder = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // TODO: we should get the item's position instead, and calculate everything relative to the item's center
  const elementPositionToXY = (
    element: HTMLDivElement,
    itemPosition: ItemType["desktop"]
  ) => {
    if (!containerRef.current || !element) return

    const {
      left: elLeft,
      top: elTop,
      width: elWidth,
      height: elHeight,
    } = element.getBoundingClientRect()
    const elXCenter = elLeft + elWidth / 2
    const elYCenter = elTop + elHeight / 2

    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = Math.max(elXCenter - left, 0)
    const y = Math.max(elYCenter - top, 0)

    return calculateGridPosition(x, y, itemPosition)
  }

  const [placeholderPosition, setPlaceholderPosition] = useState<
    ItemType["desktop"] | null
  >(null)

  const [items, setItems] = useState<ItemType[]>(initialItems)

  const handleDrag: DragEventHandler<HTMLDivElement> = (event) => {
    if (!containerRef.current) return

    const element = event.target as HTMLDivElement
    const htmlDataItemId = element.getAttribute("data-item-id")

    const itemsClone = structuredClone(items)
    const itemToMove = itemsClone.find(
      (item) => item.id.toString() === htmlDataItemId
    )

    if (!itemToMove) return

    if (!placeholderPosition) setPlaceholderPosition(itemToMove.desktop)

    const newPosition = elementPositionToXY(element, {
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
    <Container
      maxW="container.lg"
      py={{ base: 6, md: 9 }}
      px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    >
      <Stack spacing={4}>
        <Button
          leftIcon={<Plus />}
          maxW="max-content"
          onClick={() =>
            setItems((prevItems) => {
              if (!prevItems) return []
              const prevItemsById = prevItems.sort((a, b) => a.id - b.id)
              const lastItem = prevItems.at(-1)

              return [
                ...prevItems,
                {
                  id: (prevItemsById.at(-1)?.id ?? 0) + 1,
                  desktop: {
                    width: 1,
                    height: 1,
                    x: 1,
                    y: (lastItem?.desktop.y ?? 0) + 1,
                  },
                } as ItemType,
              ]
            })
          }
        >
          Add card
        </Button>

        <Grid
          templateColumns="repeat(6, 1fr)"
          gridAutoRows="minmax(145px, auto)"
          gap="0.875rem"
          ref={containerRef}
        >
          <LayoutGroup>
            <AnimatePresence>
              {items?.map((item) => (
                <Item
                  key={item.id}
                  data-item-id={item.id.toString()}
                  item={item}
                  drag={handleDrag}
                  drop={() => setPlaceholderPosition(null)}
                />
              ))}

              {placeholderPosition && (
                <GridItem
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
                  zIndex={10}
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
            </AnimatePresence>
          </LayoutGroup>
        </Grid>
      </Stack>
    </Container>
  )
}

export default PageBuilder
