import { useDisclosure } from "@chakra-ui/react"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useAccess from "components/[guild]/hooks/useAccess"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { Requirement } from "types"

const GuildCheckoutContext = createContext<{
  requirement: Requirement
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  isInfoModalOpen: boolean
  onInfoModalOpen: () => void
  onInfoModalClose: () => void
  pickedCurrency: string
  setPickedCurrency: Dispatch<SetStateAction<string>>
  agreeWithTOS: boolean
  setAgreeWithTOS: Dispatch<SetStateAction<boolean>>
  txHash: string
  setTxHash: Dispatch<SetStateAction<string>>
  txSuccess: boolean
  setTxSuccess: Dispatch<SetStateAction<boolean>>
  txError: boolean
  setTxError: Dispatch<SetStateAction<boolean>>
}>(undefined)

const GuildCheckoutProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const requirement = useRequirementContext()
  const { mutate: mutateAccess } = useAccess(requirement?.roleId)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isInfoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure()
  const [pickedCurrency, setPickedCurrency] = useState<string>()
  const [agreeWithTOS, setAgreeWithTOS] = useState(false)

  const triggerConfetti = useJsConfetti()

  const [txHash, setTxHash] = useState("")
  const [txError, setTxError] = useState(false)
  const [txSuccess, setTxSuccess] = useState(false)

  useEffect(() => {
    if (!txHash || !isOpen || isInfoModalOpen) return
    onClose()
    onInfoModalOpen()
  }, [txHash])

  useEffect(() => {
    if (!txSuccess) return
    triggerConfetti()
    mutateAccess()
  }, [txSuccess])

  return (
    <GuildCheckoutContext.Provider
      value={{
        requirement,
        isOpen,
        onOpen,
        onClose,
        isInfoModalOpen,
        onInfoModalOpen,
        onInfoModalClose,
        pickedCurrency,
        setPickedCurrency,
        agreeWithTOS,
        setAgreeWithTOS,
        txHash,
        setTxHash,
        txSuccess,
        setTxSuccess,
        txError,
        setTxError,
      }}
    >
      {children}
    </GuildCheckoutContext.Provider>
  )
}

const useGuildCheckoutContext = () => useContext(GuildCheckoutContext)

export { GuildCheckoutProvider, useGuildCheckoutContext }
