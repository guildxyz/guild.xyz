import {
  Box,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Image,
  Select,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import Section from "components/common/Section"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGuild from "components/[guild]/hooks/useGuild"
import useSendJoin from "components/[guild]/Onboarding/components/SummonMembers/hooks/useSendJoin"
import { AnimatePresence, motion } from "framer-motion"
import useServerData from "hooks/useServerData"
import { ArrowRight } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import usePoapLinks from "../../hooks/usePoapLinks"
import { useCreatePoapContext } from "../CreatePoapContext"
import usePoapEventDetails from "../Requirements/components/VoiceParticipation/hooks/usePoapEventDetails"
import EmbedButton from "./components/EmbedButton"
import EmbedDescription from "./components/EmbedDescription"
import EmbedTitle from "./components/EmbedTitle"
import ManageEvent from "./components/ManageEvent/ManageEvent"

const MotionBox = motion(Box)

type PoapDiscordEmbedForm = {
  poapId: number
  channelId: string
  title: string
  description: string
  button: string
  serverId: string
}

const EMBED_IMAGE_SIZE = "70px"

const Distribution = (): JSX.Element => {
  const { poapData, onCloseHandler, discordServerId } = useCreatePoapContext()
  const { poapEventDetails } = usePoapEventDetails()

  const embedBg = useColorModeValue("gray.100", "#2F3136")

  const { name, imageUrl, mutateGuild } = useGuild()
  const { poapLinks } = usePoapLinks(poapData.id)

  const {
    data: { categories },
  } = useServerData(discordServerId)

  const mappedChannels = useMemo(() => {
    if (!categories?.length) return []

    return (
      Object.values(categories)
        ?.map((category) => category.channels)
        ?.flat() ?? []
    )
  }, [categories])

  const shouldShowGuildImage = imageUrl.includes("http")

  const methods = useForm<PoapDiscordEmbedForm>({
    mode: "onSubmit",
    defaultValues: {
      poapId: poapData?.id,
      title: poapData?.name,
      description: "Claim this magnificent POAP to your collection!",
      button: "Claim POAP",
      serverId: discordServerId,
    },
  })

  useEffect(() => {
    if (!methods.register) return
    methods.register("channelId", { required: "This field is required " })
  }, [])

  const triggerConfetti = useJsConfetti()

  const { isLoading, isSigning, onSubmit, response, signLoadingText } = useSendJoin(
    "POAP",
    () => {
      triggerConfetti()
      // Mutating the guild data, so we get back the correct "activated" status for the POAPs
      mutateGuild()
    }
  )

  const loadingText = signLoadingText || "Sending"

  if (poapLinks?.total === 0)
    return <Text>Please upload mint links before distributing your POAP.</Text>

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      <MotionBox
        key={response ? "success" : "setup-form"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
      >
        {response ? (
          <VStack spacing={6}>
            <VStack
              pb={32}
              spacing={6}
              alignItems={{ base: "start", md: "center" }}
              bg="url('/img/poap-illustration.svg') no-repeat bottom center"
            >
              <Text fontSize="3xl" fontFamily="display" fontWeight="bold">
                Hooray!
              </Text>
              <Text textAlign={{ base: "left", md: "center" }} maxW="md">
                You've successfully dropped a POAP and set up a claim button on your
                Discord server for it - now your friends can claim this magnificent
                POAP to their collection!
              </Text>
            </VStack>

            <Flex w="full" justifyContent="end">
              <Button colorScheme="indigo" onClick={onCloseHandler}>
                Done
              </Button>
            </Flex>
          </VStack>
        ) : (
          <Stack spacing={8} divider={<Divider />}>
            {poapEventDetails?.voiceChannelId && (
              <Section title="Manage event">
                <ManageEvent />
              </Section>
            )}
            <Section title="Distribute POAP">
              <VStack spacing={8} alignItems={"start"}>
                <Text>
                  The bot will send an embed to your Discord server members can claim
                  the POAP from - feel free to customize it below!
                </Text>

                <FormProvider {...methods}>
                  <Box mx="auto" w="full" maxW="md">
                    <FormControl
                      isRequired
                      isInvalid={!!methods.formState.errors?.channelId}
                    >
                      <FormLabel>Channel to send to</FormLabel>

                      {mappedChannels?.length <= 0 ? (
                        <Button
                          isDisabled
                          isLoading
                          loadingText="Loading channels"
                          w="full"
                        />
                      ) : (
                        <Select
                          {...methods.register("channelId", {
                            required: "This field is required ",
                          })}
                          maxW="sm"
                        >
                          {mappedChannels.map((channel, index) => (
                            <option
                              key={channel.id}
                              value={channel.id}
                              defaultChecked={index === 0}
                            >
                              {channel.name}
                            </option>
                          ))}
                        </Select>
                      )}

                      <FormErrorMessage>
                        {methods.formState.errors?.channelId?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>

                  <FormControl
                    maxW="md"
                    mb={12}
                    isInvalid={
                      !!methods.formState.errors.title ||
                      !!methods.formState.errors.description ||
                      !!methods.formState.errors.button
                    }
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
                                {name}
                              </Text>
                            </HStack>

                            <EmbedTitle />
                            <EmbedDescription />
                          </VStack>

                          <Box m={1} boxSize={EMBED_IMAGE_SIZE}>
                            <Image
                              src="/requirementLogos/poap.svg"
                              alt="POAP image"
                            />
                          </Box>
                        </Grid>

                        <Text mt={2} fontSize="xs">
                          Do not share your private keys. We will never ask for your
                          seed phrase.
                        </Text>
                      </Box>
                      <EmbedButton />
                    </Box>

                    <FormErrorMessage>Some fields are empty</FormErrorMessage>
                  </FormControl>

                  <Flex w="full" justifyContent="end">
                    <Tooltip
                      label="You can't send the claim embed until your event isn't finished."
                      isDisabled={
                        !poapEventDetails?.voiceChannelId ||
                        !!poapEventDetails?.voiceEventEndedAt
                      }
                      shouldWrapChildren
                    >
                      <Button
                        colorScheme="indigo"
                        rightIcon={<Icon as={ArrowRight} />}
                        onClick={methods.handleSubmit(onSubmit, console.log)}
                        isLoading={isLoading || isSigning}
                        loadingText={loadingText}
                        isDisabled={
                          isLoading ||
                          isSigning ||
                          response ||
                          (poapEventDetails?.voiceChannelId &&
                            !poapEventDetails?.voiceEventEndedAt)
                        }
                      >
                        Send embed
                      </Button>
                    </Tooltip>
                  </Flex>

                  <DynamicDevTool control={methods.control} />
                </FormProvider>
              </VStack>
            </Section>
          </Stack>
        )}
      </MotionBox>
    </AnimatePresence>
  )
}

export default Distribution
