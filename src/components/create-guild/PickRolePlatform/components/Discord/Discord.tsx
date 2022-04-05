import {
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
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
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import processDiscordError from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/utils/processDiscordError"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import { Check } from "phosphor-react"
import { Dispatch, SetStateAction, useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import useSWR from "swr"
import { GuildFormType, SelectOption } from "types"
import useSetImageAndNameFromPlatformData from "../../hooks/useSetImageAndNameFromPlatformData"
import useServerData from "./hooks/useServerData"

type Props = {
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
}

const fetchUsersServers = (_, fetcherFn) =>
  fetcherFn("https://discord.com/api/users/@me/guilds").then((res) => {
    if (!Array.isArray(res)) return []
    return res
      .filter(({ owner }) => owner)
      .map(({ id, icon, name }) => ({
        img: icon
          ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
          : "./default_discord_icon.png",
        label: name,
        value: id,
      }))
  })

const Discord = ({ setUploadPromise }: Props) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    onOpen: onDCAuthOpen,
    fetcherWithDCAuth,
    error: dcAuthError,
    isAuthenticating,
  } = useDCAuth("identify guilds")
  const { data: servers, isValidating } = useSWR(
    fetcherWithDCAuth ? ["usersServers", fetcherWithDCAuth] : null,
    fetchUsersServers
  )

  const serverId = useWatch({ name: "DISCORD.platformId" })

  const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } =
    usePopupWindow(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverId}&permissions=8&scope=bot%20applications.commands`
    )

  const toast = useToast()

  useEffect(() => {
    if (dcAuthError) {
      const { title, description } = processDiscordError(dcAuthError)
      toast({ status: "error", title, description })
    }
  }, [dcAuthError])

  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const invite = useWatch({ name: "discord_invite" })

  const platform = useWatch({ name: "platform" })
  const {
    data: { channels, isAdmin, serverIcon, serverName },
    isLoading,
    error,
  } = useServerData(serverId, {
    refreshInterval: activeAddBotPopup ? 2000 : 0,
  })
  useEffect(() => {
    if (channels?.length > 0) {
      if (activeAddBotPopup) activeAddBotPopup.close()
      setValue("channelId", channels[0].id)
    }
  }, [channels, setValue, activeAddBotPopup])

  useSetImageAndNameFromPlatformData(serverIcon, serverName, setUploadPromise)

  useEffect(() => {
    if (platform !== "DISCORD") return
    if (serverId?.length > 0) setValue("DISCORD.platformId", serverId?.toString())
    if (isAdmin) onOpen()
  }, [serverId, platform, setValue, onOpen, isAdmin])

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
        <FormControl isInvalid={!!errors?.discord_invite} isDisabled={!!servers}>
          <FormLabel>1. Authenticate</FormLabel>
          <InputGroup>
            {!!servers ? (
              <Button isDisabled h="10" w="full" rightIcon={<Check />}>
                Connected
              </Button>
            ) : (
              <Button
                colorScheme="DISCORD"
                h="10"
                w="full"
                onClick={onDCAuthOpen}
                isLoading={isAuthenticating}
                loadingText="Check the popup window"
                data-dd-action-name="Open Discord authentication popup"
              >
                Connect Discord
              </Button>
            )}
          </InputGroup>
          <FormErrorMessage>{errors?.discord_invite?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.discord_invite} isDisabled={!servers}>
          <FormLabel>2. Select Server</FormLabel>
          <InputGroup>
            {serverId && (
              <InputLeftElement>
                <OptionImage
                  img={servers?.find((server) => server.value === serverId)?.img}
                  alt={`Selected server"s image`}
                />
              </InputLeftElement>
            )}
            <Controller
              name={"DISCORD.platformId"}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <StyledSelect
                  ref={ref}
                  options={servers}
                  value={servers?.find((_server) => _server.value === value)}
                  onChange={(selectedOption: SelectOption) => {
                    onChange(selectedOption?.value)
                  }}
                  onBlur={onBlur}
                  isLoading={isValidating}
                />
              )}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.discord_invite?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!serverId}>
          <FormLabel>3. Add bot</FormLabel>
          {typeof isAdmin !== "boolean" ? (
            <Button
              h="10"
              w="full"
              onClick={openAddBotPopup}
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
          <FormLabel>4. Set starting channel</FormLabel>
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
