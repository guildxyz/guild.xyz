import { useDisclosure } from "@/hooks/useDisclosure"
import useMembership from "components/explorer/hooks/useMembership"
import useClearUrlQuery from "hooks/useClearUrlQuery"
import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { JoinModal } from "./JoinModal"

const JoinModalContext = createContext<() => void>(() => {})

const JoinModalProvider = ({ children }: PropsWithChildren<any>): JSX.Element => {
  const query = useClearUrlQuery()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isMember } = useMembership()

  useEffect(() => {
    if (typeof query.join === "string") onOpen()
  }, [query.join, onOpen])

  // when you're not connected yet but is already a member and use the modal to connect
  useEffect(() => {
    if (isMember) onClose()
  }, [isMember, onClose])

  return (
    <JoinModalContext.Provider value={onOpen}>
      {children}
      <JoinModal isOpen={isOpen} onClose={onClose} />
    </JoinModalContext.Provider>
  )
}

const useOpenJoinModal = () => useContext(JoinModalContext)

export { JoinModalProvider, useOpenJoinModal }
