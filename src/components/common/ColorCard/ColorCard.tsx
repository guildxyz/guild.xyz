import { BoxProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import Card from "../Card"

type Props = {
  color: string
} & BoxProps

const ColorCard = ({
  color,
  children,
  ...boxProps
}: PropsWithChildren<Props>): JSX.Element => (
  <Card
    role="group"
    position="relative"
    p={{ base: 5, sm: 6 }}
    w="full"
    borderWidth={2}
    borderColor={color}
    overflow="visible"
    {...boxProps}
  >
    {children}
  </Card>
)

export default ColorCard
