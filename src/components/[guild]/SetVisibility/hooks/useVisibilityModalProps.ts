import { useDisclosure } from "@chakra-ui/react"

// Filtering unused props, so we can spread the return value when using this hook
const useVisibilityModalProps = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return { isOpen, onOpen, onClose }
}

export default useVisibilityModalProps
