import { useDisclosure } from "@chakra-ui/react"
import DiscardAlert from "components/common/DiscardAlert"
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
  step: string
  setStep: (newStep: string) => void
  targetRoleId?: number
  activeTab: RoleTypeToAddTo
  setActiveTab: Dispatch<SetStateAction<RoleTypeToAddTo>>
  shouldShowCloseAlert: boolean
  setShouldShowCloseAlert: Dispatch<SetStateAction<boolean>>
  isBackButtonDisabled: boolean
  setIsBackButtonDisabled: Dispatch<SetStateAction<boolean>>
}>(undefined)

const AddRewardProvider = ({
  targetRoleId,
  children,
}: PropsWithChildren<{ targetRoleId?: number }>) => {
  const modalRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const scrollToTop = () => modalRef.current?.scrollTo({ top: 0 })

  const [selection, setSelectionOg] = useState<PlatformName>()

  const [step, setStepOg] = useState<string>()

  const setStep = (newStep: string) => {
    setStepOg(newStep)
    scrollToTop()
  }

  const [activeTab, setActiveTab] = useState<RoleTypeToAddTo>(
    RoleTypeToAddTo.EXISTING_ROLE
  )

  const setSelection = (newSelection: PlatformName) => {
    setSelectionOg(newSelection)
    scrollToTop()
  }

  const [shouldShowCloseAlert, setShouldShowCloseAlert] = useState(false)
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false)

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
        onClose: () => {
          if (shouldShowCloseAlert) {
            onDiscardAlertOpen()
            return
          }

          onClose()
          setShouldShowCloseAlert(false)
          setIsBackButtonDisabled(false)
        },
        scrollToTop,
        selection,
        setSelection,
        step,
        setStep,
        targetRoleId,
        activeTab,
        setActiveTab,
        shouldShowCloseAlert,
        setShouldShowCloseAlert,
        isBackButtonDisabled,
        setIsBackButtonDisabled,
      }}
    >
      {children}
      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={() => {
          onClose()
          onDiscardAlertClose()
          setShouldShowCloseAlert(false)
          setIsBackButtonDisabled(false)
        }}
      />
    </AddRewardContext.Provider>
  )
}

const useAddRewardContext = () => useContext(AddRewardContext)

export { AddRewardProvider, useAddRewardContext }
