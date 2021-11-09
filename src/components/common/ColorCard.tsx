import { useColorMode } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"
import Card from "./Card"

type Props = {
  color: string
} & Rest

const ColorCard = ({
  color,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()
  return (
    <Card
      role="group"
      position="relative"
      p={{ base: 5, sm: 7 }}
      w="full"
      h="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={color}
      overflow="visible"
      {...rest}
    >
      {children}
    </Card>
  )
}

export default ColorCard
