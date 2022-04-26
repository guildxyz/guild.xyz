import { Box } from "@chakra-ui/react"
import PanelDescription from "./components/PanelDescription"
import PanelTitle from "./components/PanelTitle"

const PanelBody = () => (
  <Box
    bg="gray.800"
    borderRadius={"4px"}
    p="4"
    borderLeft={"4px solid var(--chakra-colors-DISCORD-500)"}
  >
    <PanelTitle />
    <PanelDescription />
  </Box>
)

export default PanelBody
