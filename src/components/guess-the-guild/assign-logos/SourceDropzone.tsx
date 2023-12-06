import { Box, useColorModeValue } from "@chakra-ui/react"
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

  return (
    <Box
      p="2"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap="2"
      minHeight={size}
      border="2"
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
