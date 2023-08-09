import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import dynamic from "next/dynamic"
import { Plus } from "phosphor-react"
import platforms from "platforms/platforms"
import { useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName } from "types"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"

const DynamicDefaultAddPlatformModalContent = dynamic(
  () => import("platforms/DefaultAddPlatformModalContent")
)

const AddRewardButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const methods = useForm()
  const modalRef = useRef(null)

  const [selection, setSelectionOg] = useState<PlatformName>(null)

  const closeModal = () => {
    setSelection(null)
    methods.reset()
    onClose()
  }

  const goBack = () => setSelection(null)

  const scrollToTop = () => modalRef.current?.scrollTo({ top: 0 })

  const setSelection = (platform: PlatformName) => {
    setSelectionOg(platform)
    scrollToTop()
  }

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  const { AddPlatformModalContent } = platforms[selection] ?? {}

  return (
    <>
      <Button
        leftIcon={<Plus />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
      >
        Add reward
      </Button>

      <FormProvider {...methods}>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          size="4xl"
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          <ModalContent minH="550px">
            {selection ? (
              AddPlatformModalContent ? (
                <AddPlatformModalContent goBack={goBack} onSuccess={closeModal} />
              ) : (
                <DynamicDefaultAddPlatformModalContent
                  modalRef={modalRef}
                  goBack={goBack}
                  selection={selection}
                  setSelection={setSelection}
                  closeModal={closeModal}
                />
              )
            ) : (
              <>
                <ModalCloseButton />
                <ModalHeader>Add reward</ModalHeader>
                <ModalBody ref={modalRef}>
                  <PlatformsGrid onSelection={setSelection} showPoap />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  )
}

export default AddRewardButton
