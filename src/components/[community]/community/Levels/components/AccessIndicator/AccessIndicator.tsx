import { Box, BoxProps, useColorMode } from "@chakra-ui/react"
import { motion } from "framer-motion"
import type { Rest } from "temporaryData/types"
import useIndicatorData from "./hooks/useIndicatorData"
import type LevelState from "./types"

const MotionBox = motion<BoxProps>(Box)

const Indicator = ({ ...rest }: Rest) => (
  <MotionBox
    pos="absolute"
    left="0"
    width="6px"
    height="0"
    transition={{ type: "just" }}
    {...rest}
  />
)

type Props = {
  levelsState: { [x: string]: LevelState }
}

const AccessIndicator = ({ levelsState }: Props) => {
  const { colorMode } = useColorMode()
  const { accessHeight, focusHeight, pendingHeight, focusColor } =
    useIndicatorData(levelsState)

  return (
    <>
      <Indicator
        top={accessHeight + pendingHeight}
        opacity={colorMode === "light" ? 0.3 : 0.4}
        animate={{
          height: focusHeight,
          background: focusColor,
        }}
      />
      <Indicator
        top={accessHeight}
        bg="primary.500"
        animate={{
          height: pendingHeight,
          opacity: pendingHeight > 0 ? [0.4, 0.7, 0.4] : 0.7,
        }}
        transition={{
          height: { type: "just" },
          opacity: {
            repeat: pendingHeight > 0 && Infinity,
            duration: 1,
            type: "tween",
          },
        }}
      />
      <Indicator
        top="0"
        bg="primary.500"
        animate={{
          height: accessHeight,
        }}
      />
    </>
  )
}

export default AccessIndicator
export type { LevelState }
