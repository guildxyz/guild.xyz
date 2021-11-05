import {
  Button,
  Icon,
  IconButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { useColorContext } from "components/common/ColorContext"
import Modal from "components/common/Modal"
import { useHall } from "components/[hall]/Context"
import { PaintBrush } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

const CustomizationButton = (): JSX.Element => {
  const hall = useHall()

  const methods = useForm({
    mode: "all",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useEdit(onClose)
  const { localThemeColor, setLocalThemeMode, localThemeMode, setLocalThemeColor } =
    useColorContext()

  const onCloseHandler = () => {
    const themeMode = hall.theme?.[0]?.mode
    const themeColor = hall.theme?.[0]?.color
    if (themeMode !== localThemeMode) setLocalThemeMode(themeMode)
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    onClose()
  }

  useEffect(() => {
    methods.setValue("theme.color", hall.theme?.[0]?.color)
  }, [])

  return (
    <>
      <IconButton
        aria-label="Edit"
        minW={12}
        rounded="2xl"
        colorScheme="alpha"
        onClick={onOpen}
        icon={<Icon as={PaintBrush} />}
      />
      <Modal {...{ isOpen, onClose: onCloseHandler }}>
        <ModalOverlay>
          <ModalContent>
            <FormProvider {...methods}>
              <ModalHeader>Edit appearance</ModalHeader>

              <ModalBody>
                <VStack alignItems="start" spacing={4} width="full">
                  <ColorPicker label="Main color" fieldName={"theme.color"} />
                  <ColorModePicker label="Color mode" fieldName="theme.mode" />
                  <VStack alignItems="start" spacing={1}>
                    <Text fontWeight="medium">Theme</Text>
                    <Tag>Coming soon</Tag>
                  </VStack>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseHandler}>Cancel</Button>
                <Button
                  isDisabled={!methods.formState.isDirty || isLoading}
                  colorScheme="primary"
                  isLoading={isLoading}
                  onClick={methods.handleSubmit(onSubmit)}
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

export default CustomizationButton
