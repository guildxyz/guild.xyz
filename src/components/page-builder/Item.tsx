import { GridItem } from "@chakra-ui/react"
import Card from "components/common/Card"
import { motion } from "framer-motion"
import { ItemType } from "pages/page-builder"
import { DragEventHandler, useState } from "react"

type Props = {
  item: ItemType
  drag: DragEventHandler
  drop: DragEventHandler
}

const MotionCard = motion(Card)

const Item = ({ item, drag, drop }: Props) => {
  const x = item.desktop.x
  const y = item.desktop.y

  const [moving, setMoving] = useState(false)

  const handleDrop = (e) => {
    setMoving(false)
    drop(e)
  }

  return (
    <GridItem
      as={MotionCard}
      gridColumnStart={x}
      gridRowStart={y}
      colSpan={typeof item.desktop.width === "number" ? item.desktop.width : 6}
      rowSpan={Number(item.desktop.height)}
      drag
      alignItems="center"
      justifyContent="center"
      onDragStart={() => setMoving(true)}
      onDrag={drag}
      onDragEnd={handleDrop}
      animate={moving ? {} : { x: 0, y: 0 }}
    >
      Card
    </GridItem>
  )
}
export default Item
