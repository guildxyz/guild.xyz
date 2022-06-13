import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"

type Props = {
  EditModal: (props: { isOpen: boolean; onClose: () => void }) => JSX.Element
}

const EditButton = ({ EditModal }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button size="sm" onClick={onOpen}>
        Edit
      </Button>
      <EditModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default EditButton
