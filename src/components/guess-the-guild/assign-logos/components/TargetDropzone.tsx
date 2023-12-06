import { Box, useColorModeValue } from "@chakra-ui/react"
import { useDroppable } from "@dnd-kit/core"
import { ReactNode } from "react"

const TargetDropzone = ({
  id,
  children,
  avatarSize,
}: {
  id: string
  children?: ReactNode
  avatarSize: any
}) => {
  const { isOver, setNodeRef } = useDroppable({ id })
  const borderColor = useColorModeValue("gray.300", "gray.500")
  const borderColorHover = useColorModeValue("green.400", "green.600")

  return (
    <Box
      h={avatarSize}
      w={avatarSize}
      minW={avatarSize}
      minH={avatarSize}
      rounded="100%"
      border="2px"
      borderStyle="dashed"
      borderColor={isOver ? borderColorHover : borderColor}
      p="1"
      boxSizing="content-box"
      transition="0.5s"
      ref={setNodeRef}
    >
      {children}
    </Box>
  )
}

export default TargetDropzone
