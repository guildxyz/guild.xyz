import { Box } from "@chakra-ui/react"
import Card from "components/common/Card"
import { motion } from "framer-motion"
import { BASE_SIZE, ItemType, PADDING } from "pages/page-builder"
import { DragEventHandler } from "react"

type Props = {
  item: ItemType
  drag: DragEventHandler
  dragEnd: DragEventHandler
}

const MotionCard = motion(Card)

const Item = ({ item, drag, dragEnd }: Props) => {
  const x = item.desktop.position % 6
  const y = Math.floor(item.desktop.position / 6)

  const sizeToPx = (unit: number) => {
    return unit * BASE_SIZE + (unit - 1) * PADDING
  }

  const posToPx = (unit: number) => {
    return unit * (BASE_SIZE + PADDING)
  }

  return (
    <>
      <Box
        as={MotionCard}
        drag
        alignItems="center"
        justifyContent="center"
        height={sizeToPx(Number(item.desktop.height))}
        width={sizeToPx(Number(item.desktop.width))}
        position={"absolute"}
        left={posToPx(x)}
        top={posToPx(y)}
        onDrag={drag}
        onDragEnd={dragEnd}
      >
        Card
      </Box>
    </>
  )
}

export default Item
