import {
  Box,
  Circle,
  HStack,
  Icon,
  Img,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { PlatformName } from "types"

type Props = {
  name: string
  image?: string
  type: PlatformName
}

const LinkedSocialAccount = ({ name, image, type }: Props): JSX.Element => {
  const circleBorderColor = useColorModeValue("gray.100", "gray.800")

  return (
    <HStack spacing={4} alignItems="center" w="full">
      <Box position="relative" boxSize={8}>
        <Img boxSize={8} rounded="full" src={image} alt={name} />
        <Circle
          position="absolute"
          right={-1}
          bottom={-1}
          size={5}
          bgColor={type === "TELEGRAM" ? "TELEGRAM.500" : "DISCORD.500"}
          borderWidth={1}
          borderColor={circleBorderColor}
        >
          <Icon as={type === "TELEGRAM" ? TelegramLogo : DiscordLogo} boxSize={3} />
        </Circle>
      </Box>
      <Text as="span" fontWeight="bold">
        {name}
      </Text>
    </HStack>
  )
}

export default LinkedSocialAccount
