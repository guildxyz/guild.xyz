import { Container, Grid } from "@chakra-ui/react"
import Card from "components/common/Card"
import Item from "components/page-builder/Item"
import { motion } from "framer-motion"
import { useRef, useState } from "react"

export type ItemType = {
  id: number
  desktop: {
    x: number
    y: number
    width: 1 | 2 | 3 | 4 | 5 | 6
    height: 1 | 2 | 3 | 4 | 5 | 6
  }
  // mobile: {
  //   position: number
  //   width: 1 | 2
  //   height: 1 | 2 | "AUTO"
  // }
  type: "REWARD" | "ROLE" | "PAGE" | "SECTION"
  data: any
}

const items: ItemType[] = [
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
const MotionGrid = motion(Grid)

function calculateGridPosition(relativeMouseX, relativeMouseY) {
  const itemSizeWithPadding = BASE_SIZE + PADDING

  const gridX = Math.min(Math.floor(relativeMouseX / itemSizeWithPadding) + 1, 6)
  const gridY = Math.floor(relativeMouseY / itemSizeWithPadding) + 1

  return [gridX, gridY]
}

const getOverlaps = (widgets: ItemType[], currentWidget: ItemType): ItemType[] => {
  if (!currentWidget) return []

  const isOverlapping = (widgetA: ItemType, widgetB: ItemType): boolean => {
    const ax1 = widgetA.desktop.x
    const ay1 = widgetA.desktop.y
    const ax2 = ax1 + widgetA.desktop.width
    const ay2 = ay1 + widgetA.desktop.height

    const bx1 = widgetB.desktop.x
    const by1 = widgetB.desktop.y
    const bx2 = bx1 + widgetB.desktop.width
    const by2 = by1 + widgetB.desktop.height

    return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1
  }

  const overlappingWidgets = widgets?.filter((widget) => {
    if (widget.id === currentWidget.id) return false
    return isOverlapping(currentWidget, widget)
  })

  return overlappingWidgets
}

const PageBuilder = () => {
  const containerRef = useRef(null)
  const [placeholder, setPlaceholder] = useState(null)

  const [widgets, setWidgets] = useState<ItemType[]>(items)

  const handleDrag = (event) => {
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = event.clientX - left
      const y = event.clientY - top
      if (x < 0 || y < 0) return

      const placeholderPosition = calculateGridPosition(x, y)
      if (
        placeholder?.[0] !== placeholderPosition?.[0] ||
        placeholder?.[1] !== placeholderPosition?.[1]
      )
        setPlaceholder(placeholderPosition)
    }
  }

  const mousePositionToXY = (clientX: number, clientY: number) => {
    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = clientX - left
    const y = clientY - top
    if (x < 0 || y < 0) return

    return calculateGridPosition(x, y)
  }

  const moveDownOverlaps = (overlaps, widgets) => {
    if (overlaps.length < 1) return widgets
    overlaps.forEach((w) => {
      const movedDown = { ...w, desktop: { ...w.desktop, y: w.desktop.y + 1 } }
      widgets = widgets.map((w) => (w.id === movedDown.id ? movedDown : w))
      widgets = moveDownOverlaps(getOverlaps(widgets, movedDown), widgets)
    })

    return widgets
  }

  const handleDrop = (event: any, item: ItemType) => {
    const target = mousePositionToXY(event.clientX, event.clientY)

    // Move widget to target
    const widgetMoved = {
      ...item,
      desktop: { ...item.desktop, x: target[0], y: target[1] },
    }
    let updatedWidgets = widgets.map((w) => {
      if (w.id === item.id) {
        return widgetMoved
      }
      return w
    })

    // Push down overlapped widgets
    const overlaps = getOverlaps(updatedWidgets, widgetMoved)
    updatedWidgets = moveDownOverlaps(overlaps, updatedWidgets)
    setWidgets(updatedWidgets)
    setPlaceholder(null)
  }

  return (
    <Container
      maxW="container.lg"
      py={{ base: 6, md: 9 }}
      px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    >
      <Grid
        templateColumns="repeat(6, 1fr)"
        gridAutoRows="145px"
        gap="14px"
        ref={containerRef}
      >
        {widgets?.map((item) => (
          <Item
            key={item.id}
            item={item}
            drag={handleDrag}
            drop={(e) => handleDrop(e, item)}
          />
        ))}

        {placeholder && (
          <MotionGrid
            layout
            as={MotionCard}
            zIndex={10}
            background={"transparent"}
            border={2}
            shadow={"none"}
            borderColor={"rgba(255,255,255,0.2)"}
            borderStyle={"dashed"}
            gridColumnStart={placeholder?.[0]}
            gridRowStart={placeholder?.[1]}
          ></MotionGrid>
        )}
      </Grid>
    </Container>
  )
}

export default PageBuilder
