import { useDisclosure } from "@chakra-ui/react"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
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
  processing: boolean
  setProcessing: Dispatch<SetStateAction<boolean>>
  success: boolean
  setSuccess: Dispatch<SetStateAction<boolean>>
  txError: boolean
  setTxError: Dispatch<SetStateAction<boolean>>
}>(undefined)

const GuildCheckoutProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const requirement = useRequirementContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isInfoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure()
  const [pickedCurrency, setPickedCurrency] = useState<string>()
  const [agreeWithTOS, setAgreeWithTOS] = useState(false)

  // TEMP...
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txError, setTxError] = useState(false)

  useEffect(() => {
    if (!processing && !success && !txError) return
    onClose()
    onInfoModalOpen()
  }, [processing, success, txError])

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
        processing,
        setProcessing,
        success,
        setSuccess,
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
