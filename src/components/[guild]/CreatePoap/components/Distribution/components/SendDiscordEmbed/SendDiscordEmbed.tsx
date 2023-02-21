import {
  Box,
  Center,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGuild from "components/[guild]/hooks/useGuild"
import useSendJoin from "components/[guild]/Onboarding/components/SummonMembers/hooks/useSendJoin"
import useServerData from "hooks/useServerData"
import { DiscordLogo } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import { Poap } from "types"
import DiscordServerRewardPicker from "../../../DiscordServerRewardPicker"
import EmbedButton from "./components/EmbedButton"
import EmbedDescription from "./components/EmbedDescription"
import EmbedTitle from "./components/EmbedTitle"

type PoapDiscordEmbedForm = {
  poapId: number
  channelId: string
  title: string
  description: string
  button: string
  serverId: string
}

type Props = {
  poap: Poap
  onSuccess: () => void
}

const EMBED_IMAGE_SIZE = "70px"

const SendDiscordEmbed = ({ poap, onSuccess }: Props): JSX.Element => {
  const { poapEventDetails } = usePoapEventDetails()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const embedBg = useColorModeValue("gray.100", "#2F3136")

  const { name, imageUrl, mutateGuild } = useGuild()

  const shouldShowGuildImage = imageUrl.includes("http")

  const methods = useForm<PoapDiscordEmbedForm>({
    mode: "onSubmit",
    defaultValues: {
      poapId: poap?.id,
      title: poap?.name,
      description: "Mint this magnificent POAP to your collection!",
      button: "Mint POAP",
      serverId: null,
    },
  })
  const discordServerId = methods.watch("serverId")

  const {
    data: { categories },
  } = useServerData(discordServerId)

  const mappedChannels =
    categories?.map((category) => category.channels)?.flat() ?? []

  const triggerConfetti = useJsConfetti()

  const { isLoading, isSigning, onSubmit, response, signLoadingText } = useSendJoin(
    "POAP",
    () => {
      triggerConfetti()
      onClose()
      onSuccess()
      // Mutating the guild data, so we get back the correct "activated" status for the POAPs
      mutateGuild()
    }
  )

  const loadingText = signLoadingText || "Sending"

  return (
    <>
      <Button
        colorScheme="indigo"
        leftIcon={<Icon as={DiscordLogo} />}
        onClick={onOpen}
      >
        Activate with claim embed
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="lg">
          <ModalHeader>Set up mint embed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...methods}>
              <VStack spacing={6} alignItems={"start"}>
                <Text>
                  The bot will send an embed to your Discord server members can mint
                  the POAP from - feel free to customize it below!
                </Text>

                <DiscordServerRewardPicker />

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
                          <Image src="/requirementLogos/poap.svg" alt="POAP image" />
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
              </VStack>
              <DynamicDevTool control={methods.control} />
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <Tooltip
              label="You can't send the mint embed until your event isn't finished."
              isDisabled={
                !poapEventDetails?.voiceChannelId ||
                !!poapEventDetails?.voiceEventEndedAt
              }
              shouldWrapChildren
            >
              <Button
                colorScheme="green"
                onClick={methods.handleSubmit(onSubmit)}
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
                Activate & send embed
              </Button>
            </Tooltip>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SendDiscordEmbed
