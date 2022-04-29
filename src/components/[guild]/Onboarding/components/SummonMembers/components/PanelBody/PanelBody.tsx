import { Box, useColorModeValue } from "@chakra-ui/react"
import PanelDescription from "./components/PanelDescription"
import PanelTitle from "./components/PanelTitle"

const PanelBody = () => {
  const bg = useColorModeValue("gray.200", "gray.800")

  return (
    <Box
      bg={bg}
      borderRadius={"4px"}
      p="4"
      borderLeft={"4px solid var(--chakra-colors-DISCORD-500)"}
    >
      <PanelTitle />
      <PanelDescription />
    </Box>
  )
}

export default PanelBody
