import {
  Button,
  Flex,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import useServerData from "hooks/useServerData"
import { useRef } from "react"
import { useRolePlatform } from "../../../RolePlatformProvider"
import PlatformCard from "../../PlatformCard"
import ChannelsToGate from "./components/ChannelsToGate"
import BaseLabel from "./components/DiscordLabel"
import RoleToManage from "./components/RoleToManage"

const DiscordCard = ({ onRemove }) => {
  const { type, nativePlatformId, roleId } = useRolePlatform()
  const serverData = useServerData(
    (type === "DISCORD" && nativePlatformId) || undefined
  )
  // TODO: there's no roleId from BE anymore, should find another solution
  const isNew = !roleId
  const modalContentRef = useRef()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <PlatformCard
      colSpan={2}
      imageUrl={serverData?.data?.serverIcon || "/default_discord_icon.png"}
      name={serverData?.data?.serverName || ""}
      onRemove={onRemove}
    >
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
      >
        {(isNew && <BaseLabel isAdded />) || <BaseLabel />}

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
          <ModalContent
            minW={isNew ? { md: "xl" } : undefined}
            ref={modalContentRef}
          >
            <ModalHeader>Discord settings</ModalHeader>
            <ModalBody>
              <VStack spacing={5} alignItems="start">
                {isNew && <RoleToManage />}
                <ChannelsToGate />
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
    </PlatformCard>
  )
}

export default DiscordCard
