import { Box, Collapse, useColorModeValue } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import parseDescription from "utils/parseDescription"
import { RoleCardCollapseProps } from ".."

const MAX_INITIAL_REQS_HEIGHT = 250

type Props = {
  description: string
} & RoleCardCollapseProps

const RoleDescription = ({
  description,
  descriptionRef,
  initialRequirementsRef,
  isExpanded,
  onToggleExpanded,
}: Props) => {
  const descriptionHeight =
    descriptionRef.current?.getBoundingClientRect().height || 24
  const [maxInitialReqsHeight, setMaxInitialReqsHeight] = useState(
    MAX_INITIAL_REQS_HEIGHT
  )

  useEffect(() => {
    if (!initialRequirementsRef.current) return

    const observer = new ResizeObserver((entries) => {
      const reqsHeight = entries[0].contentRect.height
      if (reqsHeight > MAX_INITIAL_REQS_HEIGHT)
        setMaxInitialReqsHeight(reqsHeight - 25)
    })

    observer.observe(initialRequirementsRef.current)

    return () => {
      observer.disconnect()
    }
  }, [initialRequirementsRef.current])

  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-800)"
  )

  if (descriptionHeight <= MAX_INITIAL_REQS_HEIGHT)
    return (
      <Box ref={descriptionRef} px={5} pb={3} wordBreak="break-word">
        {parseDescription(description)}
      </Box>
    )

  return (
    <Collapse
      in={isExpanded}
      startingHeight={maxInitialReqsHeight}
      style={{ position: "relative" }}
    >
      <Box
        ref={descriptionRef}
        px={5}
        pb={3}
        wordBreak="break-word"
        cursor={"pointer"}
        onClick={onToggleExpanded}
      >
        {parseDescription(description)}
      </Box>

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height={6}
        bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
        pointerEvents="none"
        opacity={isExpanded ? 0 : 0.6}
        transition="opacity 0.2s ease"
      />
    </Collapse>
  )
}

export default RoleDescription
