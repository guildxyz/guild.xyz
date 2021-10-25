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
import ColorButton from "components/common/ColorButton"
import { useColorContext } from "components/common/ColorContext"
import Modal from "components/common/Modal"
import { useHall } from "components/[hall]/Context"
import { PaintBrush } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useGuild } from "../../[guild]/Context"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

type Props = {
  white?: boolean
}

const CustomizationButton = ({ white }: Props): JSX.Element => {
  const guild = useGuild()
  const hall = useHall()

  const methods = useForm({
    mode: "all",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useEdit(onClose)
  const { localThemeColor, setLocalThemeMode, localThemeMode, setLocalThemeColor } =
    useColorContext()

  const onCloseHandler = () => {
    const themeMode = hall?.theme?.[0]?.mode || guild?.themeMode
    const themeColor = hall?.theme?.[0]?.color || guild?.themeColor
    if (themeMode !== localThemeMode) setLocalThemeMode(themeMode)
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    onClose()
  }

  useEffect(() => {
    if (hall && !guild) {
      methods.setValue("theme.color", hall.theme?.[0]?.color)
    } else {
      methods.setValue("themeColor", guild.themeColor)
    }
  }, [])

  return (
    <>
      {white ? (
        <IconButton
          aria-label="Edit"
          minW={12}
          rounded="2xl"
          isLoading={isLoading}
          onClick={onOpen}
          icon={<Icon as={PaintBrush} />}
        />
      ) : (
        <ColorButton
          color="primary.500"
          rounded="2xl"
          isLoading={isLoading}
          onClick={onOpen}
        >
          <Icon as={PaintBrush} />
        </ColorButton>
      )}
      <Modal {...{ isOpen, onClose: onCloseHandler }}>
        <ModalOverlay>
          <ModalContent>
            <FormProvider {...methods}>
              <ModalHeader>Edit appearance</ModalHeader>

              <ModalBody>
                <VStack alignItems="start" spacing={4} width="full">
                  <ColorPicker
                    label="Main color"
                    fieldName={hall ? "theme.color" : "themeColor"}
                  />
                  {hall && (
                    <>
                      <ColorModePicker label="Color mode" fieldName="theme.mode" />
                      <VStack alignItems="start" spacing={1}>
                        <Text fontWeight="medium">Theme</Text>
                        <Tag>Coming soon</Tag>
                      </VStack>
                    </>
                  )}
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseHandler}>Cancel</Button>
                <Button
                  isDisabled={!methods.formState.isDirty || isLoading}
                  colorScheme="primary"
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
