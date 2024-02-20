import { EASINGS, GridItem } from "@chakra-ui/react"
import Card from "components/common/Card"
import { motion } from "framer-motion"
import { ItemType } from "pages/page-builder"
import { DragEventHandler, forwardRef, useState } from "react"

type Props = {
  item: ItemType
  drag: DragEventHandler
  drop: DragEventHandler
  "data-item-id": string
}

const MotionCard = motion(Card)

const Item = forwardRef(({ item, drag, drop, ...rest }: Props, ref) => {
  const x = item.desktop.x
  const y = item.desktop.y

  const [isDragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    setDragging(false)
    drop(e)
  }

  return (
    <GridItem
      ref={ref}
      layout
      as={MotionCard}
      gridColumnStart={x}
      gridRowStart={y}
      colSpan={typeof item.desktop.width === "number" ? item.desktop.width : 6}
      rowSpan={Number(item.desktop.height)}
      drag
      dragSnapToOrigin
      alignItems="center"
      justifyContent="center"
      onDragStart={() => setDragging(true)}
      onDrag={drag}
      onDragEnd={handleDrop}
      zIndex={isDragging ? 1001 : 11}
      {...rest}
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
    >
      Card
    </GridItem>
  )
})

export default Item
