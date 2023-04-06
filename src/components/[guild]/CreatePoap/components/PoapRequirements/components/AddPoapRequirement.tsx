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
import useToast from "hooks/useToast"
import { useRef, useState } from "react"

const AddPoapRequirement = ({
  title,
  description,
  rightIcon,
  isDisabled = false,
  FormComponent,
  poapId,
  onAdd = null,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [onCloseAttemptToast, setOnCloseAttemptToast] = useState()
  const toast = useToast()
  const buttonRef = useRef()

  const handleAdd = (data) => {
    onAdd(data)
    onClose()
  }

  return (
    <>
      <AddCard
        ref={buttonRef}
        {...{ title, description, rightIcon }}
        py="5"
        mb="2 !important"
        onClick={onOpen}
        isDisabled={isDisabled}
      />
      <Modal
        isOpen={isOpen}
        onClose={
          onCloseAttemptToast
            ? () => toast({ status: "warning", title: onCloseAttemptToast })
            : onClose
        }
        scrollBehavior="inside"
        finalFocusRef={buttonRef}
      >
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
            <FormComponent
              baseFieldPath=""
              poapId={poapId}
              onClose={onClose}
              setOnCloseAttemptToast={setOnCloseAttemptToast}
              onAdd={handleAdd}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPoapRequirement
