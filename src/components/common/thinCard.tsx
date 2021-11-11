import { Box, useColorMode } from "@chakra-ui/react"
import { motion } from "framer-motion"
import React, { ReactNode } from "react"
import Card from "./Card"

const MotionBox = motion(Box)

interface ReactChildren {
  children: ReactNode
}
const ThinCard = ({ children }: ReactChildren): JSX.Element => {
  const { colorMode } = useColorMode()
  return (
    <Box position="relative" width="full">
      <MotionBox
        position="absolute"
        inset={-0.5}
        top={0.5}
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
        w="full"
        h="full"
        bg={colorMode === "light" ? "white" : "gray.700"}
        //borderWidth={2}
        overflow="visible"
      >
        {children}
      </Card>
    </Box>
  )
}

export default ThinCard
