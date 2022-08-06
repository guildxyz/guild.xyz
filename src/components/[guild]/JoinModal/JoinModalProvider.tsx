import { useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import useIsMember from "../hooks/useIsMember"
import JoinModal from "./JoinModal"

const JoinModalContext = createContext<() => void>(null)

const JoinModalProvider = ({ children }: PropsWithChildren<any>): JSX.Element => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMember = useIsMember()

  useEffect(() => {
    if (router.query.hash) onOpen()
  }, [router.query.hash])

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
