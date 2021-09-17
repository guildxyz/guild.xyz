import { Box, useColorMode } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { PropsWithChildren } from "react"
import Card from "./Card"

type Props = {
  color: string
}

const MotionBox = motion(Box)

const ColorCard = ({ color, children }: PropsWithChildren<Props>): JSX.Element => {
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
        p={{ base: 5, sm: 7 }}
        w="full"
        h="full"
        bg={colorMode === "light" ? "white" : "gray.700"}
        borderWidth={2}
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
    </Box>
  )
}

export default ColorCard
