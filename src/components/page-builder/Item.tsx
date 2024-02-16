import { GridItem } from "@chakra-ui/react"
import Card from "components/common/Card"
import { motion } from "framer-motion"
import { ItemType } from "pages/page-builder"

type Props = {
  item: ItemType
}

const MotionCard = motion(Card)

const Item = ({ item }: Props) => (
  <GridItem
    as={MotionCard}
    colStart={(item.desktop.position + 1) % 6}
    colSpan={typeof item.desktop.width === "number" ? item.desktop.width : 6}
    drag
    alignItems="center"
    justifyContent="center"
  >
    Card
  </GridItem>
)

export default Item
