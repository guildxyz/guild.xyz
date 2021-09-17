import { useColorMode } from '@chakra-ui/react'
import { PropsWithChildren } from "react"
import Card from './Card'

type Props = {
  color: string
}

const ColorCard = ({ color, children }: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()
  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      pt={10}
      pb={7}
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      // borderColor={RequirementTypeColors[type]}
      borderColor={color}
      overflow="visible"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "primary.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
    >
      {children}
      </Card>
  )
}

export default ColorCard
