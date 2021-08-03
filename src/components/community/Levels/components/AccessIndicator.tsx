import { Box, BoxProps, useColorMode } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Rest } from "temporaryData/types"
import { LevelIndicatorState } from "./Level/hooks/useLevelIndicatorState"

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

type LevelState = {
  isDisabled: boolean
  element: HTMLElement
  state?: LevelIndicatorState
}

type Props = {
  levelsState: { [x: string]: LevelState }
}

const AccessIndicator = ({ levelsState }: Props) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const { colorMode } = useColorMode()
  const [accessHeight, setAccessHeight] = useState(0)
  const [pendingHeight, setPendingHeight] = useState(0)
  const [focusHeight, setFocusHeight] = useState(0)
  const [focusColor, setFocusColor] = useState("var(--chakra-colors-primary-500)")

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const levelsArray: LevelState[] = Object.values(levelsState)

    if (levelsArray.length === 0) {
      return
    }

    // Set the height of the access indicator
    const accessedLevels = levelsArray.filter(
      (level: LevelState) => level.state === "access"
    )

    let newAccessHeight = 0
    accessedLevels.forEach((level: LevelState) => {
      newAccessHeight += level.element.getBoundingClientRect().height
    })

    setAccessHeight(newAccessHeight)

    // Set the height of the pending indicator
    let pendingLevel = null
    pendingLevel = levelsArray.find((level: LevelState) => level.state === "pending")
    const newPendingHeight =
      pendingLevel?.element.getBoundingClientRect().bottom -
        pendingLevel?.element.parentElement.getBoundingClientRect().top -
        accessHeight || 0

    setPendingHeight(newPendingHeight)

    // Set the height of the focus indicator
    let focusLevel = null
    focusLevel = levelsArray.find((level: LevelState) => level.state === "focus")
    const newFocusHeight =
      focusLevel?.element.getBoundingClientRect().bottom -
        focusLevel?.element.parentElement.getBoundingClientRect().top -
        accessHeight -
        pendingHeight || 0

    setFocusHeight(newFocusHeight)

    // Set the indicator color
    const disabled = levelsArray.pop().isDisabled
    setFocusColor(
      disabled ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-primary-500)"
    )
  }, [windowSize, levelsState, focusHeight, pendingHeight, accessHeight, colorMode])

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
        opacity="0.7"
        animate={{
          height: pendingHeight,
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          height: { type: "just" },
          opacity: {
            repeat: Infinity,
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
