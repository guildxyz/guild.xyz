import { useDisclosure } from "@chakra-ui/react"
import { createContext, PropsWithChildren, useContext } from "react"
import EditGuildDrawer from "./EditGuildDrawer"

const EditGuildDrawerContext = createContext<{
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}>(undefined)

const EditGuildDrawerProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <EditGuildDrawerContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}

      <EditGuildDrawer isOpen={isOpen} onClose={onClose} />
    </EditGuildDrawerContext.Provider>
  )
}

const useEditGuildDrawer = () => useContext(EditGuildDrawerContext)

export { EditGuildDrawerProvider, useEditGuildDrawer }
