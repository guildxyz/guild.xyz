import { Box, Container } from "@chakra-ui/react"
import Card from "components/common/Card"
import Item from "components/page-builder/Item"
import { motion } from "framer-motion"
import { useRef, useState } from "react"

export type ItemType = {
  id: number
  desktop: {
    position: number
    width: 1 | 2 | 3 | "FULL"
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

const items: ItemType[] = [
  {
    id: 0,
    desktop: {
      position: 0,
      width: 1,
      height: 1,
    },
    type: "ROLE",
    data: {},
  },
  {
    id: 1,
    desktop: {
      position: 1,
      width: 1,
      height: 1,
    },

    type: "ROLE",
    data: {},
  },
  {
    id: 2,
    desktop: {
      position: 2,
      width: 2,
      height: 1,
    },
    type: "ROLE",
    data: {},
  },
  {
    id: 3,
    desktop: {
      position: 6,
      width: 2,
      height: 1,
    },
    type: "ROLE",
    data: {},
  },
]

export const BASE_SIZE = 145
export const PADDING = 14

function calculateNearestGridPosition(x, y) {
  const itemSizeWithPadding = BASE_SIZE + PADDING // item size + padding

  // Calculate nearest grid index for x and y
  const nearestGridIndexX = Math.floor(x / itemSizeWithPadding)
  const nearestGridIndexY = Math.floor(y / itemSizeWithPadding)

  // Calculate actual x and y positions
  const gridX = nearestGridIndexX * itemSizeWithPadding
  const gridY = nearestGridIndexY * itemSizeWithPadding

  return [gridX, gridY]
}

const MotionCard = motion(Card)

const PageBuilder = () => {
  // const {} = usePositionReorder(items)

  const containerRef = useRef(null)
  const [placeholder, setPlaceholder] = useState(null)

  const handleMouseMove = (event) => {
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = event.clientX - left
      const y = event.clientY - top
      if (x < 0 || y < 0) return

      const placeholderPosition = calculateNearestGridPosition(x, y)
      if (
        placeholder?.[0] !== placeholderPosition?.[0] ||
        placeholder?.[1] !== placeholderPosition?.[1]
      )
        setPlaceholder(placeholderPosition)
    }
  }

  return (
    <Container
      maxW="container.lg"
      py={{ base: 6, md: 9 }}
      px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    >
      <Box position={"relative"} ref={containerRef}>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            drag={handleMouseMove}
            dragEnd={() => setPlaceholder(null)}
          />
        ))}

        {placeholder && (
          <MotionCard
            animate={{ left: placeholder?.[0], top: placeholder?.[1] }}
            left={placeholder?.[0]}
            top={placeholder?.[1]}
            position={"absolute"}
            height={145}
            width={145}
            background={"transparent"}
            border={"2px"}
            borderStyle={"dashed"}
            borderColor="white"
            opacity={0.2}
          />
        )}
      </Box>
    </Container>
  )
}

export default PageBuilder
