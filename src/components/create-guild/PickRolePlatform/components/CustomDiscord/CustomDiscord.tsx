import {
  Button,
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
  useDisclosure,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Check } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useServerData from "./hooks/useServerData"

const CustomDiscord = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const invite = useWatch({ name: "discord_invite" })
  useEffect(() => {
    console.log("invite", invite)
  }, [invite])
  const platform = useWatch({ name: "platform" })
  const {
    data: { serverId, channels },
    isLoading,
  } = useServerData(invite)

  useEffect(() => {
    if (platform !== "DISCORD_CUSTOM") return
    if (serverId) setValue("DISCORD_CUSTOM.platformId", serverId)
    if (channels?.length > 0) {
      setValue("channelId", channels[0].id)
      onOpen()
    }
  }, [serverId, channels])

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing="4"
        px="5"
        py="4"
        w="full"
      >
        <FormControl
          isInvalid={errors?.discord_invite || (invite && !isLoading && !serverId)}
        >
          <FormLabel>1. Paste invite link</FormLabel>
          <Input
            {...register("discord_invite", {
              required: platform === "DISCORD_CUSTOM" && "This field is required.",
            })}
          />
          <FormErrorMessage>
            {errors?.discord_invite?.message ?? "Invalid invite"}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!serverId}>
          <FormLabel>2. Add bot</FormLabel>
          {!channels?.length ? (
            <Button
              h="10"
              w="full"
              as="a"
              href={
                !serverId
                  ? undefined
                  : "https://discord.com/api/oauth2/authorize?client_id=868172385000509460&permissions=8&scope=bot%20applications.commands"
              }
              target="_blank"
              isLoading={isLoading}
              disabled={!serverId || isLoading}
            >
              Add Agora
            </Button>
          ) : (
            <Button h="10" w="full" disabled rightIcon={<Check />}>
              Agora added
            </Button>
          )}
        </FormControl>
        <FormControl
          isInvalid={errors?.channelId}
          isDisabled={!channels?.length}
          defaultValue={channels?.[0]?.id}
        >
          <FormLabel>3. Set starting channel</FormLabel>
          <Select
            {...register("channelId", {
              required: platform === "DISCORD_CUSTOM" && "This field is required.",
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
        <ModalContent>
          <ModalHeader>Set bot access</ModalHeader>
          <ModalBody>
            <Text mb={8}>
              {/* Whoops! It seems like the <i>Medusa</i> role is not in the right
              position. Please place it above every role on your Discord server. */}
              Make sure the <i>Medusa</i> role is above every other role it has to
              manage (it'll generate one for your guild once it has been created).
            </Text>

            <video src="/videos/dc-bot-role-config-guide.webm" muted autoPlay loop>
              Your browser does not support the HTML5 video tag.
            </video>
          </ModalBody>
          <ModalFooter>
            <Button w="full" onClick={onClose}>
              Got it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CustomDiscord
