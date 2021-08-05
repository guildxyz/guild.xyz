import { useColorMode } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import LevelState from "../types"
import useWindowSize from "./useWindowSize"

const useIndicatorData = (levelsState: { [x: string]: LevelState }) => {
  const [focusColor, setFocusColor] = useState("var(--chakra-colors-primary-500)")
  const [accessHeight, setAccessHeight] = useState(0)
  const [pendingHeight, setPendingHeight] = useState(0)
  const [focusHeight, setFocusHeight] = useState(0)
  const windowSize = useWindowSize()
  const { colorMode } = useColorMode()

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

  return {
    accessHeight,
    focusHeight,
    pendingHeight,
    focusColor,
  }
}

export default useIndicatorData
