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
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  isOn: boolean
  isDisabled?: boolean
}

const Guard = ({ isOn, isDisabled = false }: Props) => {
  const { register, setValue } = useFormContext()
  const { platforms, roles } = useGuild()

  const {
    data: { channels },
  } = useServerData(platforms?.[0]?.platformId)

  const { isOpen, onClose, onOpen } = useDisclosure()

  const isGuarded = useWatch({ name: "isGuarded" })

  useEffect(() => {
    if (!isOn && isGuarded) handleOpen()
  }, [isOn, isGuarded])

  const handleOpen = () => {
    onOpen()
    setValue("serverId", platforms?.[0]?.platformId)
    setValue("channelId", roles?.[0].platforms?.[0]?.inviteChannel)
  }

  const handleClose = () => {
    onClose()
    setValue("isGuarded", false)
    setValue("serverId", undefined)
    setValue("channelId", undefined)
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
            {...register("isGuarded")}
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
