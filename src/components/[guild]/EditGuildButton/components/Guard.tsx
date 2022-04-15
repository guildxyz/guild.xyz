import {
  Box,
  Button,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Section from "components/common/Section"
import Disclaimer from "components/guard/setup/ServerSetupCard/components/Disclaimer"
import PickSecurityLevel from "components/guard/setup/ServerSetupCard/components/PickSecurityLevel"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  isOn: boolean
}

const Guard = ({ isOn }: Props) => {
  const { register, setValue } = useFormContext()

  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    isOpen: isTurnOffModalOpen,
    onClose: onTurnOffModalClose,
    onOpen: onTurnOffModalOpen,
  } = useDisclosure()

  const isGuarded = useWatch({ name: "isGuarded" })
  useEffect(() => console.log({ isGuarded }), [isGuarded])

  useEffect(() => {
    if (!isOn && isGuarded) onOpen()
    else if (isOn && !isGuarded) onTurnOffModalOpen()
  }, [isOn, isGuarded])

  const handleClose = () => {
    onClose()
    setValue("isGuarded", false)
    setValue("grantAccessToExistingUsers", undefined)
  }

  return (
    <>
      <FormControl>
        <Switch
          {...register("isGuarded")}
          isChecked={isGuarded}
          colorScheme="DISCORD"
          display="inline-flex"
          whiteSpace={"normal"}
        >
          <Box>
            <Text mb="1">Guild Guard - Bot spam protection</Text>
            <Text fontWeight={"normal"} colorScheme="gray">
              Quarantine newly joined accounts in the entry channel until they
              authenticate with Guild. This way bots can't raid and spam your server,
              or the members in DM.
            </Text>
          </Box>
        </Switch>
      </FormControl>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent minW={{ base: "auto", md: "3xl" }}>
          <ModalHeader>Guild Guard</ModalHeader>
          <ModalBody>
            <Stack spacing={8}>
              <Section title="Security level">
                <PickSecurityLevel />
              </Section>
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
  )
}

export default Guard
