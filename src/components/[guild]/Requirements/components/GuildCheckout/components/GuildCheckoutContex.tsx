import { useDisclosure } from "@chakra-ui/react"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { Requirement } from "types"

const GuildCheckoutContext = createContext<{
  requirement: Requirement
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pickedCurrency: string
  setPickedCurrency: Dispatch<SetStateAction<string>>
  agreeWithTOS: boolean
  setAgreeWithTOS: Dispatch<SetStateAction<boolean>>
}>(undefined)

const GuildCheckoutProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const requirement = useRequirementContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [pickedCurrency, setPickedCurrency] = useState<string>()
  const [agreeWithTOS, setAgreeWithTOS] = useState(false)

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

const useGuildCheckoutContext = () => useContext(GuildCheckoutContext)

export { GuildCheckoutProvider, useGuildCheckoutContext }
