import { useDisclosure } from "@chakra-ui/react"
import useClearUrlQuery from "hooks/useClearUrlQuery"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import useIsMember from "../hooks/useIsMember"
import JoinModal from "./JoinModal"

const JoinModalContext = createContext<() => void>(null)

const JoinModalProvider = ({ children }: PropsWithChildren<any>): JSX.Element => {
  const query = useClearUrlQuery()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMember = useIsMember()

  useEffect(() => {
    if (typeof query.join === "string") onOpen()
  }, [query.join])

  useEffect(() => {
    if (isMember) onClose()
  }, [isMember])

  return (
    <JoinModalContext.Provider value={onOpen}>
      {children}
      <JoinModal {...{ isOpen, onClose }} />
    </JoinModalContext.Provider>
  )
}

const useOpenJoinModal = () => useContext(JoinModalContext)

export default JoinModalProvider
export { useOpenJoinModal }
