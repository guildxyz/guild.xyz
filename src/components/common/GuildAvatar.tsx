import { Box, Img, useColorMode } from "@chakra-ui/react"
import addressAvatarPairs from "constants/avatars/addressAvatarPairs"

type Props = {
  size?: number
  address: string
}

const GuildAvatar = ({ size = 8, address }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Box
      padding={2}
      boxSize={size + 4}
      bgColor={colorMode === "light" ? "gray.700" : "transparent"}
      rounded="full"
    >
      <Img
        src={`/avatars/${addressAvatarPairs[address.slice(-2)]}.svg`}
        boxSize={size}
      />
    </Box>
  )
}

export default GuildAvatar
