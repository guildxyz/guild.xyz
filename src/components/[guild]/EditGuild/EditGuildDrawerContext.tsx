import { useDisclosure } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import { createContext, PropsWithChildren, useContext } from "react"
import useGuildPermission from "../hooks/useGuildPermission"

const EditGuildDrawerContext = createContext<{
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}>(undefined)

const DynamicEditGuildDrawer = dynamic(() => import("./EditGuildDrawer"))

const EditGuildDrawerProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const { isAdmin } = useGuildPermission()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <EditGuildDrawerContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
      {isAdmin && <DynamicEditGuildDrawer isOpen={isOpen} onClose={onClose} />}
    </EditGuildDrawerContext.Provider>
  )
}

const useEditGuildDrawer = () => useContext(EditGuildDrawerContext)

export { EditGuildDrawerProvider, useEditGuildDrawer }
