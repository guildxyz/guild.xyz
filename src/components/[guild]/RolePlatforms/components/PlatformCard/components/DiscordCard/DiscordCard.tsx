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
  const { guildPlatform, isNewRole } = useRolePlatform()
  const serverData = useServerData(guildPlatform.platformGuildId)
  const modalContentRef = useRef()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <PlatformCard
      type="DISCORD"
      colSpan={2}
      imageUrl={serverData?.data?.serverIcon || "/default_discord_icon.png"}
      name={serverData?.data?.serverName || ""}
      onRemove={onRemove}
    >
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
      >
        {(isNewRole && <BaseLabel isAdded />) || <BaseLabel />}

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
            minW={isNewRole ? { md: "xl" } : undefined}
            ref={modalContentRef}
          >
            <ModalHeader>Discord settings</ModalHeader>
            <ModalBody>
              <VStack spacing={8} alignItems="start">
                {isNewRole && <RoleToManage />}
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
