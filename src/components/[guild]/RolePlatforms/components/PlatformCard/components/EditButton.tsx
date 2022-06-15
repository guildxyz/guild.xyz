import { ChakraProps, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"

type Props = {
  Modal: (props: { isOpen: boolean; onClose: () => void }) => JSX.Element
} & ChakraProps

const EditButton = ({ Modal, ...rest }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button size="sm" onClick={onOpen} {...rest}>
        Edit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default EditButton
