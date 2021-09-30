import { Box, useColorMode } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { PropsWithChildren } from "react"
import Card from "./Card"

type Props = {
  color: string
  padding?: boolean
}

const MotionBox = motion(Box)

const ColorCard = ({
  color,
  padding = true,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()
  return (
    <Box position="relative" width="full">
      <MotionBox
        position="absolute"
        inset={-0.5}
        top={0.5}
        bgColor={color}
        borderRadius="2xl"
        filter="auto"
        blur="8px"
        initial={{
          opacity: 0.25,
        }}
        animate={{
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ ease: "linear", duration: 2, repeat: Infinity }}
      />
      <Card
        role="group"
        position="relative"
        p={padding ? { base: 5, sm: 7 } : 0}
        w="full"
        h="full"
        bg={colorMode === "light" ? "white" : "gray.700"}
        borderWidth={2}
        borderColor={color}
        overflow="visible"
      >
        {children}
      </Card>
    </Box>
  )
}

export default ColorCard
