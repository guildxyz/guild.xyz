import { useDisclosure } from "@chakra-ui/react"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { Requirement } from "types"
import { useRequirementContext } from "../../RequirementContext"

const PurchaseRequirementContext = createContext<{
  requirement: Requirement
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pickedCurrency: string
  setPickedCurrency: Dispatch<SetStateAction<string>>
  agreeWithTOS: boolean
  setAgreeWithTOS: Dispatch<SetStateAction<boolean>>
}>(undefined)

const PurchaseRequirementProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const requirement = useRequirementContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [pickedCurrency, setPickedCurrency] = useState<string>()
  const [agreeWithTOS, setAgreeWithTOS] = useState(false)

  return (
    <PurchaseRequirementContext.Provider
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
    </PurchaseRequirementContext.Provider>
  )
}

const usePurchaseRequirementContext = () => useContext(PurchaseRequirementContext)

export { PurchaseRequirementProvider, usePurchaseRequirementContext }
