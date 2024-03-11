import {
  Box,
  Center,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Image from "next/image"
import PanelDescription from "./components/PanelDescription"
import PanelTitle from "./components/PanelTitle"

const GUILD_CASTLE_SIZE = 70
const GUILD_LOGO_DC_URL = "/img/dc-message.png"

const PanelBody = () => {
  const bg = useColorModeValue("gray.100", "#2F3136")

  const { imageUrl, name } = useGuild()

  const shouldShowGuildImage = imageUrl.includes("http")
  const guildImageDimension = shouldShowGuildImage ? 30 : 15

  return (
    <Box
      bg={bg}
      borderRadius={"4px"}
      p="4"
      borderLeft={"4px solid var(--chakra-colors-DISCORD-500)"}
    >
      <Grid templateColumns={`1fr ${GUILD_CASTLE_SIZE}px`} gap={3}>
        <VStack alignItems="start">
          <HStack spacing={2}>
            <Center h="26px" w="26px" borderRadius="full" overflow={"hidden"}>
              <Image
                width={guildImageDimension}
                height={guildImageDimension}
                src={(shouldShowGuildImage && imageUrl) || GUILD_LOGO_DC_URL}
                alt="Guild Icon"
              />
            </Center>

            <Text fontSize={"sm"} fontWeight="bold">
              {name}
            </Text>
          </HStack>
          <PanelTitle />
          <PanelDescription />
        </VStack>

        <Box m={1}>
          <Image
            src={GUILD_LOGO_DC_URL}
            alt="Guild Logo"
            width={GUILD_CASTLE_SIZE}
            height={GUILD_CASTLE_SIZE}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Grid>

      <Text mt={2} fontSize="xs">
        Do not share your private keys. We will never ask for your seed phrase.
      </Text>
    </Box>
  )
}

export default PanelBody
