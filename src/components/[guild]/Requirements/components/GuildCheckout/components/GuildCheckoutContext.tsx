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
import {
  TransactionStatusProvider,
  useTransactionStatusContext,
} from "./TransactionStatusContext"

export type GuildCheckoutContextType = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pickedCurrency: `0x${string}`
  setPickedCurrency: Dispatch<SetStateAction<`0x${string}`>>
  agreeWithTOS: boolean
  setAgreeWithTOS: Dispatch<SetStateAction<boolean>>
}

const GuildCheckoutContext = createContext<GuildCheckoutContextType>(undefined)

const GuildCheckoutProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const { isTxModalOpen, onTxModalOpen, txHash } = useTransactionStatusContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [pickedCurrency, setPickedCurrency] = useState<`0x${string}`>()
  const [agreeWithTOS, setAgreeWithTOS] = useState(false)

  useEffect(() => {
    if (!txHash || !isOpen || isTxModalOpen) return
    onTxModalOpen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
