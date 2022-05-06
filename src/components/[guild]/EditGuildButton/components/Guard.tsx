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
  Text,
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
  const {
    isOpen: isTurnOffModalOpen,
    onClose: onTurnOffModalClose,
    onOpen: onTurnOffModalOpen,
  } = useDisclosure()

  const isGuarded = useWatch({ name: "isGuarded" })

  useEffect(() => {
    if (!isOn && isGuarded) handleOpen()
    else if (isOn && !isGuarded) onTurnOffModalOpen()
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
        <>
          <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent minW={{ base: "auto", md: "3xl" }}>
              <ModalHeader>Guild Guard</ModalHeader>
              <ModalBody>
                <Stack spacing={8}>
                  <EntryChannel
                    channels={channels}
                    label="Entry channel"
                    tooltip="Select the channel your join button is already in! Newly joined accounts will only see this on your server until they authenticate"
                    maxW="50%"
                    size="lg"
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
          <Modal
            isOpen={isTurnOffModalOpen}
            onClose={onTurnOffModalClose}
            closeOnEsc={false}
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent minW={{ base: "auto", md: "3xl" }}>
              <ModalHeader>Turn off Guild Guard</ModalHeader>
              <ModalBody>
                <Text>
                  {`Head to Discord -> Server settings -> Roles -> Default permissions (@everyone), and turn `}
                  <Text fontWeight={"bold"} as="span">
                    View Channels
                  </Text>
                  {` back on.`}
                </Text>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={5} justifyContent="space-between" w="full">
                  <Text fontSize={"sm"} colorScheme="gray">
                    This will be automatic in the future.
                  </Text>
                  <Button colorScheme="green" onClick={onTurnOffModalClose}>
                    Got it
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  )
}

export default Guard
