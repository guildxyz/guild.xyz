import { Icon, Tag, Text, useDisclosure, VStack } from "@chakra-ui/react"
import { useColorContext } from "components/common/ColorContext"
import { useGroup } from "components/[group]/Context"
import { PaintBrush } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useGuild } from "../../[guild]/Context"
import ActionModal from "../ActionModal"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

type Props = {
  simple?: boolean
}

const CustomizationButton = ({ simple }: Props): JSX.Element => {
  const guild = useGuild()
  const group = useGroup()

  const methods = useForm({
    mode: "all",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useEdit(onClose)
  const { localThemeColor, setLocalThemeMode, localThemeMode, setLocalThemeColor } =
    useColorContext()

  const onCloseHandler = () => {
    const themeMode = group?.theme?.[0]?.mode || guild?.themeMode
    const themeColor = group?.theme?.[0]?.color || guild?.themeColor
    if (themeMode !== localThemeMode) setLocalThemeMode(themeMode)
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    onClose()
  }

  useEffect(() => {
    if (group && !guild) {
      methods.setValue("theme.color", group.theme?.[0]?.color)
    } else {
      methods.setValue("themeColor", guild.themeColor)
    }
  }, [])

  return (
    <ActionModal
      title="Edit appearance"
      buttonStyle={simple ? "simple" : "color"}
      buttonIcon={<Icon as={PaintBrush} />}
      isDisabled={!methods.formState.isDirty || isLoading}
      isLoading={isLoading}
      onButtonClick={methods.handleSubmit(onSubmit)}
      okButtonLabel="Save"
      okButtonColor="primary"
      onClose={onCloseHandler}
      {...{ isOpen, onOpen }}
    >
      <FormProvider {...methods}>
        <VStack alignItems="start" spacing={4} width="full">
          <ColorPicker
            label="Main color"
            fieldName={group ? "theme.color" : "themeColor"}
          />
          {group && (
            <>
              <ColorModePicker label="Color mode" fieldName="theme.mode" />
              <VStack alignItems="start" spacing={1}>
                <Text fontWeight="medium">Theme</Text>
                <Tag>Coming soon</Tag>
              </VStack>
            </>
          )}
        </VStack>
      </FormProvider>
    </ActionModal>
  )
}

export default CustomizationButton
