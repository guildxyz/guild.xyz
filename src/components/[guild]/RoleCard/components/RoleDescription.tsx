import { Box, Collapse, useColorModeValue } from "@chakra-ui/react"
import { MutableRefObject } from "react"
import parseDescription from "utils/parseDescription"

const MAX_REQUIREMENTS_HEIGHT = 250

type Props = {
  description: string
  descriptionRef: MutableRefObject<HTMLDivElement>
  isExpanded: boolean
  onOpenExpanded: () => void
}

const RoleDescription = ({
  description,
  descriptionRef,
  isExpanded,
  onOpenExpanded,
}: Props) => {
  const descriptionHeight =
    descriptionRef.current?.getBoundingClientRect().height || 24

  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-800)"
  )

  if (descriptionHeight <= MAX_REQUIREMENTS_HEIGHT)
    return (
      <Box ref={descriptionRef} px={5} pb={3} wordBreak="break-word">
        {parseDescription(description)}
      </Box>
    )

  return (
    <Collapse
      in={isExpanded}
      startingHeight={MAX_REQUIREMENTS_HEIGHT}
      style={{ position: "relative" }}
    >
      <Box
        ref={descriptionRef}
        px={5}
        pb={3}
        wordBreak="break-word"
        cursor={isExpanded ? "default" : "pointer"}
        onClick={isExpanded ? undefined : onOpenExpanded}
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
        opacity={isExpanded ? 0 : 0.5}
        transition="opacity 0.2s ease"
      />
    </Collapse>
  )
}

export default RoleDescription
