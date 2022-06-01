import {
  Box,
  Center,
  FormControl,
  Grid,
  HStack,
  Icon,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGuild from "components/[guild]/hooks/useGuild"
import { ArrowRight } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import EmbedButton from "./components/EmbedButton"
import EmbedDescription from "./components/EmbedDescription"
import EmbedTitle from "./components/EmbedTitle"

type PoapDiscordEmbedForm = {
  title: string
  description: string
  button: string
}

const EMBED_IMAGE_SIZE = "70px"
// TODO: fetch it dynamically!
const EMBED_IMAGE_URL =
  "https://cdn.discordapp.com/attachments/950682012866465833/951448318976884826/dc-message.png"

const SetupBot = (): JSX.Element => {
  const embedBg = useColorModeValue("gray.100", "#2F3136")

  const { imageUrl } = useGuild()

  const shouldShowGuildImage = imageUrl.includes("http")

  const methods = useForm<PoapDiscordEmbedForm>({
    mode: "all",
    defaultValues: {
      title: "Title",
      description: "Sample description...",
      button: "Claim now",
    },
  })

  return (
    <VStack spacing={12} alignItems={{ base: "start", md: "center" }}>
      <Text textAlign={{ base: "left", md: "center" }}>
        Feel free to customize the embed below - the bot will send this to your
        Discord server and your Guild's members will be able to claim their POAP
        using the button in it.
      </Text>

      <FormProvider {...methods}>
        <FormControl
          maxW="sm"
          mb={12}
          isInvalid={!!Object.keys(methods.formState.errors).length}
        >
          <Box mx="auto" maxW="sm">
            <Box
              bg={embedBg}
              borderRadius={"4px"}
              mb={2}
              p={4}
              borderLeft={"4px solid var(--chakra-colors-DISCORD-500)"}
            >
              <Grid templateColumns={`1fr ${EMBED_IMAGE_SIZE}`} gap={3}>
                <VStack alignItems="left">
                  <HStack spacing={2}>
                    <Center
                      h="26px"
                      w="26px"
                      borderRadius="full"
                      overflow={"hidden"}
                    >
                      {shouldShowGuildImage && imageUrl && (
                        <Image
                          width={26}
                          height={26}
                          src={imageUrl}
                          alt="Guild Icon"
                        />
                      )}
                    </Center>

                    <Text fontSize={"sm"} fontWeight="bold">
                      POAP name
                    </Text>
                  </HStack>

                  <EmbedTitle />
                  <EmbedDescription />
                </VStack>

                <Box m={1} boxSize={EMBED_IMAGE_SIZE}>
                  <Image
                    src={EMBED_IMAGE_URL}
                    alt="POAP image"
                    width={EMBED_IMAGE_SIZE}
                    height={EMBED_IMAGE_SIZE}
                  />
                </Box>
              </Grid>
            </Box>
            <EmbedButton />
          </Box>

          <FormErrorMessage>Some fields are empty</FormErrorMessage>
        </FormControl>

        <Button colorScheme="indigo" rightIcon={<Icon as={ArrowRight} />}>
          Send embed
        </Button>

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </VStack>
  )
}

export default SetupBot
