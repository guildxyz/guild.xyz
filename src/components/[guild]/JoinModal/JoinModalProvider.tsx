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
    if (query.hash) onOpen()
  }, [query.hash])

  useEffect(() => {
    if (isMember) onClose()
  }, [isMember])

  return (
    <JoinModalContext.Provider value={onOpen}>
      {children}
      <JoinModal {...{ isOpen, onClose, query }} />
    </JoinModalContext.Provider>
  )
}

const useOpenJoinModal = () => useContext(JoinModalContext)

export default JoinModalProvider
export { useOpenJoinModal }
