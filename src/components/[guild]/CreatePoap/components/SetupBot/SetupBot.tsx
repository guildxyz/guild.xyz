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
import EntryChannel from "components/create-guild/EntryChannel"
import useGuild from "components/[guild]/hooks/useGuild"
import useSendJoin from "components/[guild]/Onboarding/components/SummonMembers/hooks/useSendJoin"
import useServerData from "hooks/useServerData"
import { ArrowRight } from "phosphor-react"
import { useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import EmbedButton from "./components/EmbedButton"
import EmbedDescription from "./components/EmbedDescription"
import EmbedTitle from "./components/EmbedTitle"

type PoapDiscordEmbedForm = {
  channelId: string
  title: string
  description: string
  button: string
}

const EMBED_IMAGE_SIZE = "70px"

const SetupBot = (): JSX.Element => {
  const embedBg = useColorModeValue("gray.100", "#2F3136")

  const { imageUrl, platforms } = useGuild()
  const {
    data: { channels },
  } = useServerData(platforms?.[0]?.platformId)

  const shouldShowGuildImage = imageUrl.includes("http")

  const methods = useForm<PoapDiscordEmbedForm>({
    mode: "onSubmit",
    defaultValues: {
      title: "Claim your POAP",
      description: "Claim this magnificent POAP to your collection!",
      button: "Claim POAP",
    },
  })

  const { isLoading, isSigning, onSubmit, response } = useSendJoin("POAP")

  const loadingText = useMemo(() => {
    if (isSigning) return "Check your wallet"
    return "Sending"
  }, [isSigning])

  return (
    <VStack spacing={12} alignItems={{ base: "start", md: "center" }}>
      <Text textAlign={{ base: "left", md: "center" }}>
        Feel free to customize the embed below - the bot will send this to your
        Discord server and your Guild's members will be able to claim their POAP
        using the button in it.
      </Text>

      <FormProvider {...methods}>
        <Box mx="auto" w="full" maxW="md">
          <EntryChannel
            channels={channels}
            label="Channel to send to"
            tooltip="Users won't be able to send messages here so the button doesn't get spammed away"
            maxW="sm"
          />
        </Box>

        <FormControl
          maxW="md"
          mb={12}
          isInvalid={!!Object.keys(methods.formState.errors).length}
        >
          <Box mx="auto" maxW="md">
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
                  <Image src="/requirementLogos/poap.svg" alt="POAP image" />
                </Box>
              </Grid>

              <Text mt={2} fontSize="xs">
                Do not share your private keys. We will never ask for your seed
                phrase.
              </Text>
            </Box>
            <EmbedButton />
          </Box>

          <FormErrorMessage>Some fields are empty</FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="indigo"
          rightIcon={<Icon as={ArrowRight} />}
          onClick={methods.handleSubmit(onSubmit, console.log)}
          isLoading={isLoading || isSigning}
          loadingText={loadingText}
          isDisabled={isLoading || isSigning || response}
        >
          Send embed
        </Button>

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </VStack>
  )
}

export default SetupBot
