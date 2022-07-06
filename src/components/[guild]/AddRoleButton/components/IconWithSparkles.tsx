import { Box, Icon } from "@chakra-ui/react"
import { Sparkle } from "phosphor-react"

const IconWithSparkles = ({ children }) => (
  <Box pos="relative">
    {children}
    <Icon
      as={Sparkle}
      pos="absolute"
      color="yellow.400"
      weight="fill"
      top={"-3px"}
      right={"-3px"}
      boxSize="3"
    />
  </Box>
)

export default IconWithSparkles
