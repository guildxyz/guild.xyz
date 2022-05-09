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

const GUILD_CASTLE_SIZE = "70px"

const PanelBody = () => {
  const bg = useColorModeValue("gray.200", "#2F3136")

  const { imageUrl, name } = useGuild()

  return (
    <Box
      bg={bg}
      borderRadius={"4px"}
      p="4"
      borderLeft={"4px solid var(--chakra-colors-DISCORD-500)"}
    >
      <Grid templateColumns={`1fr ${GUILD_CASTLE_SIZE}`} gap={3}>
        <VStack alignItems="left">
          <HStack spacing={2}>
            <Center h="30px" w="30px" borderRadius="full" overflow={"hidden"}>
              <Image
                width={15}
                height={15}
                src={
                  (imageUrl.includes("http") && "imageUrl") ||
                  "/guild_castle_white.png"
                }
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
            src="/guild_castle_white.png"
            alt="Guild Logo"
            width={GUILD_CASTLE_SIZE}
            height={GUILD_CASTLE_SIZE}
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
