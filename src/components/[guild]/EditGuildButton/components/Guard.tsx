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
  usePrevious,
} from "@chakra-ui/react"
import Section from "components/common/Section"
import Disclaimer from "components/guard/setup/ServerSetupCard/components/Disclaimer"
import PickSecurityLevel from "components/guard/setup/ServerSetupCard/components/PickSecurityLevel"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const Guard = () => {
  const { register, setValue } = useFormContext()

  const { isOpen, onClose, onOpen } = useDisclosure()

  const isGuarded = useWatch({ name: "isGuarded" })
  useEffect(() => console.log({ isGuarded }), [isGuarded])
  const prevIsGuarded = usePrevious(isGuarded)

  useEffect(() => {
    if (prevIsGuarded === false && isGuarded) {
      onOpen()
    } else if (isGuarded === false) {
      onClose()
    }
  }, [isGuarded, prevIsGuarded])

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

      <Modal isOpen={isOpen} onClose={onClose}>
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
              <Button
                colorScheme="gray"
                onClick={() => {
                  setValue("isGuarded", false)
                  setValue("grantAccessToExistingUsers", undefined)
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="green" onClick={onClose}>
                Done
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Guard
