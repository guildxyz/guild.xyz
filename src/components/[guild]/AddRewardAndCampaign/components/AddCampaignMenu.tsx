import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { CaretDown, Plus } from "phosphor-react"
import { useRef } from "react"

const AddCampaignMenu = () => {
  const addCampaignButtonRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          icon={<CaretDown />}
          borderTopLeftRadius="0"
          borderBottomLeftRadius="0"
        />
        <Portal>
          <MenuList maxW="sm" py={0} zIndex="popover">
            <MenuItem
              ref={addCampaignButtonRef}
              onClick={onOpen}
              icon={
                <Icon
                  as={Plus}
                  mt="calc(var(--chakra-space-1) + var(--chakra-space-0-5) / 2)"
                />
              }
              alignItems="start"
              py={4}
            >
              <Stack spacing={1}>
                <Text as="span" fontWeight="semibold">
                  Add campaign
                </Text>
                <Text colorScheme="gray" fontSize="sm">
                  A campaign is a separate page with it’s own roles and rewards,
                  highlighted at the top of your guild for everyone
                </Text>
              </Stack>
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create campaign</ModalHeader>
          <ModalCloseButton />

          <ModalBody>TODO</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddCampaignMenu
