import { ChakraProps, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"

type Props = {
  EditModal: (props: { isOpen: boolean; onClose: () => void }) => JSX.Element
} & ChakraProps

const EditButton = ({ EditModal, ...rest }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button size="sm" onClick={onOpen} {...rest}>
        Edit
      </Button>
      <EditModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default EditButton
