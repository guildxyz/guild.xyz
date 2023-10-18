import { useDisclosure } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import { useRef } from "react"
import AddRoleDrawer from "../AddAndOrderRoles/components/AddRoleDrawer"

const AddRoleCard = () => {
  const addCardRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <AddCard ref={addCardRef} title="Add role" onClick={onOpen} />
      <AddRoleDrawer isOpen={isOpen} onClose={onClose} finalFocusRef={addCardRef} />
    </>
  )
}
export default AddRoleCard
