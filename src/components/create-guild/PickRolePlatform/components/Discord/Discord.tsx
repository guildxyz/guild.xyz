import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import usePopupWindow from "hooks/usePopupWindow"
import { Check } from "phosphor-react"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import useSetImageAndNameFromPlatformData from "../../hooks/useSetImageAndNameFromPlatformData"
import useServerData from "./hooks/useServerData"

type Props = {
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
}

const Discord = ({ setUploadPromise }: Props) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } =
    usePopupWindow()

  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const invite = useWatch({ name: "discord_invite" })

  const platform = useWatch({ name: "platform" })
  const {
    data: { serverId, channels, isAdmin, serverIcon, serverName },
    isLoading,
    error,
  } = useServerData(invite, {
    refreshInterval: activeAddBotPopup ? 2000 : 0,
  })

  useSetImageAndNameFromPlatformData(serverIcon, serverName, setUploadPromise)

  useEffect(() => {
    if (platform !== "DISCORD") return
    if (serverId?.length > 0) setValue("DISCORD.platformId", serverId?.toString())
    if (isAdmin) onOpen()
  }, [serverId, platform, setValue, onOpen, isAdmin])

  useEffect(() => {
    if (channels?.length > 0) {
      if (activeAddBotPopup) activeAddBotPopup.close()
      setValue("channelId", channels[0].id)
    }
  }, [channels, setValue, activeAddBotPopup])

  // Sending actionst & errors to datadog
  useEffect(() => {
    if (!invite) return
    addDatadogAction("Pasted a Discord invite link")
  }, [invite])

  useEffect(() => {
    if (!errors.discord_invite) return
    addDatadogError(
      "Discord invite field error",
      { error: errors.discord_invite },
      "custom"
    )
  }, [errors.discord_invite])

  useEffect(() => {
    if (!invite || errors.discord_invite) return
    if (channels?.length) {
      addDatadogAction("Successful platform setup")
      addDatadogAction("Successfully fetched Discord channels")
      return
    }
    addDatadogError("Could not fetch Discord channels", undefined, "custom")
  }, [invite, errors.discord_invite, channels])

  useEffect(() => {
    trigger("discord_invite")
  }, [isAdmin, serverId, error])

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing="4"
        px="5"
        py="4"
        w="full"
      >
        <FormControl isInvalid={!!errors?.discord_invite}>
          <FormLabel>1. Paste invite link</FormLabel>
          <Input
            {...register("discord_invite", {
              required: platform === "DISCORD" && "This field is required.",
              validate: (value) => {
                if (isAdmin === false) return "The bot has to be admin"
                if (error) return "Invalid invite"
                return true
              },
            })}
          />
          <FormErrorMessage>{errors?.discord_invite?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!serverId}>
          <FormLabel>2. Add bot</FormLabel>
          {typeof isAdmin !== "boolean" ? (
            <Button
              h="10"
              w="full"
              onClick={() =>
                openAddBotPopup(
                  `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverId}&permissions=8&scope=bot%20applications.commands`
                )
              }
              isLoading={isLoading || !!activeAddBotPopup}
              loadingText={!!activeAddBotPopup ? "Check the popup window" : ""}
              disabled={!serverId || isLoading || !!activeAddBotPopup}
              data-dd-action-name="Add bot (DISCORD)"
            >
              Add Guild.xyz bot
            </Button>
          ) : (
            <Button h="10" w="full" disabled rightIcon={<Check />}>
              Guild.xyz bot added
            </Button>
          )}
        </FormControl>
        <FormControl
          isInvalid={!!errors?.channelId}
          isDisabled={!channels?.length}
          defaultValue={channels?.[0]?.id}
        >
          <FormLabel>3. Set starting channel</FormLabel>
          <Select
            {...register("channelId", {
              required: platform === "DISCORD" && "This field is required.",
            })}
          >
            {channels?.map((channel, i) => (
              <option key={channel.id} value={channel.id} defaultChecked={i === 0}>
                {channel.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors?.channelId?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>Set bot access</ModalHeader>
          <ModalBody
            overflow="hidden auto !important"
            className="custom-scrollbar"
            m={1}
          >
            <Text mb={8}>
              Make sure the <i>Guild.xyz bot</i> role is above every other role it
              has to manage (it'll generate one for your guild once it has been
              created).
            </Text>

            <video src="/videos/dc-bot-role-config-guide.webm" muted autoPlay loop>
              Your browser does not support the HTML5 video tag.
            </video>
          </ModalBody>
          <ModalFooter>
            <Tooltip
              label="Make sure the Guild.xyz bot has administrator premission"
              isDisabled={!!isAdmin}
            >
              <Box w="full">
                <Button w="full" onClick={onClose} isDisabled={!isAdmin}>
                  Got it
                </Button>
              </Box>
            </Tooltip>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Discord
