import { useDisclosure } from "@chakra-ui/react"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useAccess from "components/[guild]/hooks/useAccess"
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
import {
  TransactionStatusProvider,
  useTransactionStatusContext,
} from "./TransactionStatusContext"

export type GuildCheckoutContextType = {
  requirement: Requirement
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pickedCurrency: string
  setPickedCurrency: Dispatch<SetStateAction<string>>
  agreeWithTOS: boolean
  setAgreeWithTOS: Dispatch<SetStateAction<boolean>>
}

const GuildCheckoutContext = createContext<GuildCheckoutContextType>(undefined)

const GuildCheckoutProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const requirement = useRequirementContext()
  const { mutate: mutateAccess } = useAccess(requirement?.roleId)

  const { isTxModalOpen, onTxModalOpen, txHash, txSuccess } =
    useTransactionStatusContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [pickedCurrency, setPickedCurrency] = useState<string>()
  const [agreeWithTOS, setAgreeWithTOS] = useState(false)

  const triggerConfetti = useJsConfetti()

  useEffect(() => {
    if (!txHash || !isOpen || isTxModalOpen) return
    onClose()
    onTxModalOpen()
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
        pickedCurrency,
        setPickedCurrency,
        agreeWithTOS,
        setAgreeWithTOS,
      }}
    >
      {children}
    </GuildCheckoutContext.Provider>
  )
}

const GuildCheckoutProviderWithWrapper = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => (
  <TransactionStatusProvider>
    <GuildCheckoutProvider>{children}</GuildCheckoutProvider>
  </TransactionStatusProvider>
)

const useGuildCheckoutContext = () => useContext(GuildCheckoutContext)

export {
  GuildCheckoutProviderWithWrapper as GuildCheckoutProvider,
  useGuildCheckoutContext,
}
