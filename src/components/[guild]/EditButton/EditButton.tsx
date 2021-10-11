import {
  Button,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import ColorButton from "components/common/ColorButton"
import Modal from "components/common/Modal"
import usePersonalSign from "hooks/usePersonalSign"
import { PaintBrush } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { useColorContext } from "../ColorContext"
import { useGuild } from "../Context"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

const EditButton = (): JSX.Element => {
  const { themeMode, themeColor } = useGuild()
  const methods = useForm({
    mode: "all",
    defaultValues: {
      themeColor,
    },
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data, onSubmit, isLoading } = useEdit(onClose, methods.watch)
  const { setThemeMode, themeMode: localThemeMode } = useColorContext()
  const { callbackWithSign } = usePersonalSign(true)

  const onCloseHandler = () => {
    if (themeMode !== localThemeMode) setThemeMode(themeMode)
    onClose()
  }

  return (
    <>
      <ColorButton
        color="primary.500"
        rounded="2xl"
        isLoading={isLoading}
        onClick={onOpen}
      >
        <Icon as={PaintBrush} />
      </ColorButton>
      <Modal {...{ isOpen, onClose: onCloseHandler }}>
        <ModalOverlay>
          <ModalContent>
            <FormProvider {...methods}>
              <ModalHeader>Edit appearance</ModalHeader>

              <ModalBody>
                <VStack alignItems="start" spacing={4} width="full">
                  <ColorPicker label="Main color" />
                  <ColorModePicker label="Color mode" />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseHandler}>Cancel</Button>
                <Button
                  isDisabled={!methods.formState.isDirty || isLoading || data}
                  colorScheme="primary"
                  onClick={methods.handleSubmit(callbackWithSign(onSubmit))}
                  ml={3}
                >
                  Save
                </Button>
              </ModalFooter>
            </FormProvider>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

export default EditButton
