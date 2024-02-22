import { Box, Container, EASINGS, Grid, GridItem, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import ItemWrapper from "components/page-builder/ItemWrapper"
import { AnimatePresence, DragHandlers, LayoutGroup, motion } from "framer-motion"
import Head from "next/head"
import { Plus } from "phosphor-react"
import { useRef, useState } from "react"
import move, { handleWrap } from "utils/pageBuilder"
import { uuidv7 } from "uuidv7"

export type Item = {
  id: string
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

const initialItems: Item[] = [
  {
    id: "0",
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
    id: "1",
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
    id: "2",
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
    id: "3",
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
  itemPosition: Item["desktop"]
) => {
  const x = Math.min(
    Math.floor(relativeMouseX / BASE_SIZE) + 1,
    6 - (itemPosition.width - 1)
  )
  const y = Math.floor(relativeMouseY / BASE_SIZE) + 1

  return { x, y }
}

const PageBuilder = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // TODO: we should get the item's position instead, and calculate everything relative to the item's center
  const elementPositionToXY = (
    element: HTMLDivElement,
    itemPosition: Item["desktop"]
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
    Item["desktop"] | null
  >(null)

  const [items, setItems] = useState<Item[]>(initialItems)

  const onDrag: DragHandlers["onDrag"] = (event, info) => {
    if (
      !containerRef.current ||
      (Math.abs(info.delta.x) < 1 && Math.abs(info.delta.y) < 1)
    )
      return

    const element = event.target as HTMLDivElement
    const htmlDataItemId = element.getAttribute("data-item-id")

    const itemsClone = structuredClone(items)
    const itemToMove = itemsClone.find(
      (item) => item.id.toString() === htmlDataItemId
    )

    if (!itemToMove) return

    if (!placeholderPosition) setPlaceholderPosition(itemToMove.desktop)

    const newPosition = elementPositionToXY(element, { ...itemToMove.desktop })

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
    <>
      <Head>
        <title>Guild Page Builder</title>
      </Head>
      <Box w="full" minH="100vh" overflow="hidden">
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
            </Button>

            <Grid
              templateColumns="repeat(6, 1fr)"
              gridAutoRows="minmax(145px, auto)"
              gap="0.875rem"
              ref={containerRef}
            >
              <LayoutGroup>
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

                <AnimatePresence>
                  {items?.map((item) => (
                    <ItemWrapper
                      key={item.id}
                      data-item-id={item.id}
                      item={item}
                      onDrag={onDrag}
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
                    />
                  ))}
                </AnimatePresence>
              </LayoutGroup>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default PageBuilder
