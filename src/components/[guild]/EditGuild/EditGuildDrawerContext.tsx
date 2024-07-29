import { createContext, useContext } from "react"

export const EditGuildDrawerContext = createContext<{
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}>(undefined)

const useEditGuildDrawer = () => useContext(EditGuildDrawerContext)

export { useEditGuildDrawer }
