import {
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Switch from "components/common/Switch"
import EntryChannel from "components/create-guild/EntryChannel"
import Disclaimer from "components/guard/setup/ServerSetupCard/components/Disclaimer"
import PickSecurityLevel from "components/guard/setup/ServerSetupCard/components/PickSecurityLevel"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { PlatformType } from "types"

type Props = {
  isOn: boolean
  isDisabled?: boolean
}

const Guard = ({ isOn, isDisabled = false }: Props) => {
  const { register, setValue } = useFormContext()
  const { errors } = useFormState()
  const { guildPlatforms, roles } = useGuild()

  const discordPlatform = useMemo(
    () => guildPlatforms?.find((p) => p.platformId === PlatformType.DISCORD),
    [guildPlatforms]
  )
  const discordPlatformIndex = useMemo(
    () => guildPlatforms?.findIndex((p) => p.platformId === PlatformType.DISCORD),
    [guildPlatforms]
  )

  const {
    data: { channels },
  } = useServerData(discordPlatform.platformGuildId)

  const { isOpen, onClose, onOpen } = useDisclosure()

  const isGuarded = useWatch({ name: "rolePlatforms.0.platformRoleData.isGuarded" })

  useEffect(() => {
    if (!isOn && isGuarded) handleOpen()
  }, [isOn, isGuarded])

  const handleOpen = () => {
    onOpen()
    if (discordPlatformIndex) {
      // TODO: ???
      /* setValue(
        `guildPlatforms.${discordPlatformIndex}.platformGuildId`,
        discordPlatform?.platformGuildId
      ) */
      // TODO: Set entryChannel?
    }
  }

  const handleClose = () => {
    onClose()
    setValue("isGuarded", false)
    setValue("guildPlatforms.0.platformGuildId", undefined)
    // TODO: Set entryChannel to undefined?
    setValue("grantAccessToExistingUsers", undefined)
  }

  return (
    <>
      <FormControl>
        <Tooltip
          label="You can't turn on Guild Guard until there's no join button in your server. Finish the onboarding flow first!"
          hasArrow
          isDisabled={!isDisabled}
          shouldWrapChildren
        >
          <Switch
            {...register("rolePlatforms.0.platformRoleData.isGuarded")}
            isChecked={isGuarded}
            title="Guild Guard - Bot spam protection"
            description="Quarantine newly joined accounts in the entry channel until they authenticate with Guild. This way bots can't raid and spam your server, or the members in DM."
            isDisabled={isDisabled}
          />
        </Tooltip>
      </FormControl>

      {!isDisabled && (
        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent minW={{ base: "auto", md: "3xl" }}>
            <ModalHeader>Guild Guard</ModalHeader>
            <ModalBody>
              <Stack spacing={8}>
                <EntryChannel
                  channels={channels}
                  label="Entry channel"
                  tooltip="Newly joined accounts will only see this on your server until they authenticate. Select the channel your Guild.xyz join button is already in, or choose another one and the bot will send a new button there"
                  maxW="50%"
                  size="lg"
                  showCreateOption
                  fieldName="rolePlatforms.0.platformRoleData.inviteChannel"
                  errorMessage={errors.guildPlatform?.[0]?.inviteChannel}
                />
                <PickSecurityLevel />
                <Disclaimer />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={5}>
                <Button colorScheme="gray" onClick={handleClose}>
                  Cancel
                </Button>
                <Button colorScheme="green" onClick={onClose}>
                  Done
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default Guard
