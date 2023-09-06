import { useDisclosure } from "@chakra-ui/react"
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

  useEffect(() => {
    if (!txHash || !isOpen || isTxModalOpen) return
    onClose()
    onTxModalOpen()
  }, [txHash])

  return (
    <GuildCheckoutContext.Provider
      value={{
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
