import {
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import { Modal } from "components/common/Modal"

const AddPoapRequirement = ({ title, description, FormComponent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <AddCard
        title={title}
        description={description}
        py="5"
        mb="2 !important"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <HStack>
              <Text
                w="calc(100% - 70px)"
                noOfLines={1}
              >{`Add ${title} requirement`}</Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <FormComponent baseFieldPath="" onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPoapRequirement
