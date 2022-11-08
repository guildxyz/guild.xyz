import {
  Flex,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { useRef } from "react"
import RoleToManage from "./components/RoleToManage"

const DiscordCardSettings = (): JSX.Element => {
  const { isNew } = useRolePlatform()
  const modalContentRef = useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "stretch", md: "center" }}
    >
      {/* <DiscordLabel /> */}

      <Button
        size="sm"
        onClick={onOpen}
        ml={{ base: 0, md: 3 }}
        mt={{ base: 3, md: 0 }}
      >
        Edit
      </Button>

      <Modal
        {...{ isOpen, onClose }}
        scrollBehavior="inside"
        colorScheme={"dark"}
        initialFocusRef={modalContentRef}
      >
        <ModalOverlay />
        <ModalContent minW={isNew ? { md: "xl" } : undefined} ref={modalContentRef}>
          <ModalHeader>Discord settings</ModalHeader>
          <ModalBody>
            <VStack spacing={8} alignItems="start">
              {/* {isNew &&  */}
              <RoleToManage />
              {/* } */}
              {/* <ChannelsToGate /> */}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default DiscordCardSettings
