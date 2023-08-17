import { useDisclosure } from "@chakra-ui/react"
import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react"
import { PlatformName } from "types"

type AddPlatformStep = "HOME" | "SELECT_ROLE"

export enum RoleTypeToAddTo {
  EXISTING_ROLE,
  NEW_ROLE,
}

const AddRewardContext = createContext<{
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  modalRef: MutableRefObject<any>
  scrollToTop: () => void
  selection: PlatformName
  setSelection: (newSelection: PlatformName) => void
  step: AddPlatformStep
  setStep: (newStep: AddPlatformStep) => void
  activeTab: RoleTypeToAddTo
  setActiveTab: Dispatch<SetStateAction<RoleTypeToAddTo>>
}>(undefined)

const AddRewardProvider = ({ children }: PropsWithChildren<unknown>) => {
  const modalRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const scrollToTop = () => modalRef.current?.scrollTo({ top: 0 })

  const [selection, setSelectionOg] = useState<PlatformName>()

  const setSelection = (newSelection: PlatformName) => {
    setSelectionOg(newSelection)
    scrollToTop()
  }

  const [step, setStepOg] = useState<AddPlatformStep>()

  const setStep = (newStep: AddPlatformStep) => {
    setStepOg(newStep)
    scrollToTop()
  }

  const [activeTab, setActiveTab] = useState<RoleTypeToAddTo>(
    RoleTypeToAddTo.EXISTING_ROLE
  )

  return (
    <AddRewardContext.Provider
      value={{
        modalRef,
        isOpen,
        onOpen: () => {
          setSelection(null)
          setStep("HOME")
          onOpen()
        },
        onClose,
        scrollToTop,
        selection,
        setSelection,
        step,
        setStep,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AddRewardContext.Provider>
  )
}

const useAddRewardContext = () => useContext(AddRewardContext)

export { AddRewardProvider, useAddRewardContext }
