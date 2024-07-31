import { useDisclosure } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import { PropsWithChildren } from "react"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import { EditGuildDrawerContext } from "./EditGuildDrawerContext"

const DynamicEditGuildDrawer = dynamic(() => import("./EditGuildDrawer"))
export const EditGuildDrawerProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const { isDetailed } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <EditGuildDrawerContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
      {isAdmin && isDetailed && (
        <DynamicEditGuildDrawer isOpen={isOpen} onClose={onClose} />
      )}
    </EditGuildDrawerContext.Provider>
  )
}
