import { Box, useColorModeValue, useTheme } from "@chakra-ui/react"
import { useDroppable } from "@dnd-kit/core"
import { ReactNode } from "react"

const SourceDropzone = ({
  id,
  children,
  size,
}: {
  id: string
  children?: ReactNode
  size: any
}) => {
  const { isOver, setNodeRef } = useDroppable({ id })
  const borderColor = "transparent"
  const borderColorHover = useColorModeValue("green.400", "green.600")

  const theme = useTheme()
  const paddingValue = theme.space[2]

  const addPaddingToSize = (sizeValue) => `calc(${sizeValue} + 3*${paddingValue}) `

  const minHeightWithPadding = () => {
    const pSize = size

    return {
      base: addPaddingToSize(pSize.base),
      sm: addPaddingToSize(pSize.sm),
      md: addPaddingToSize(pSize.md),
    }
  }

  return (
    <Box
      p={2}
      minH={minHeightWithPadding()}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      gap={{ base: 2, sm: 3 }}
      w="100%"
      border={2}
      borderColor={isOver ? borderColorHover : borderColor}
      borderStyle="dashed"
      transition="0.5s"
      rounded="15"
      ref={setNodeRef}
    >
      {children}
    </Box>
  )
}

export default SourceDropzone
