import { useConfetti } from "@/components/Confetti"
import { useDisclosure } from "@/hooks/useDisclosure"
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

type TransactionStatusContextType = {
  isTxModalOpen: boolean
  onTxModalOpen: () => void
  onTxModalClose: () => void
  txHash: string
  setTxHash: Dispatch<SetStateAction<string>>
  txError: Error | null
  setTxError: Dispatch<SetStateAction<Error | null>>
  txSuccess: boolean
  setTxSuccess: Dispatch<SetStateAction<boolean>>
}

const TransactionStatusContext = createContext<TransactionStatusContextType>(
  undefined as unknown as TransactionStatusContextType
)

const TransactionStatusProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const {
    isOpen: isTxModalOpen,
    onOpen: onTxModalOpen,
    onClose: onTxModalClose,
  } = useDisclosure()

  const [txHash, setTxHash] = useState("")
  const [txError, setTxError] = useState<Error | null>(null)
  const [txSuccess, setTxSuccess] = useState(false)

  const { confettiPlayer } = useConfetti()

  useEffect(() => {
    if (!txSuccess) return
    confettiPlayer.current?.("Confetti from left and right")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txSuccess])

  return (
    <TransactionStatusContext.Provider
      value={{
        isTxModalOpen,
        onTxModalOpen,
        onTxModalClose,
        txHash,
        setTxHash,
        txError,
        setTxError,
        txSuccess,
        setTxSuccess,
      }}
    >
      {children}
    </TransactionStatusContext.Provider>
  )
}

const useTransactionStatusContext = () => useContext(TransactionStatusContext)

export { TransactionStatusProvider, useTransactionStatusContext }
