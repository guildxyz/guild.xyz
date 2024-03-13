import {
  Box,
  Editable,
  EditableInput,
  IconButton,
  Text,
  Tooltip,
  useEditableControls,
} from "@chakra-ui/react"
import useShowErrorToast from "hooks/useShowErrorToast"
import { Check, PencilSimple } from "phosphor-react"
import { MutableRefObject, PropsWithChildren, ReactNode, useRef } from "react"
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form"
import REQUIREMENTS from "requirements"
import { useRequirementContext } from "./RequirementContext"

type RequirementNameForm = {
  customName?: string
}

const RequirementNameEditor = ({
  textRef,
  isLoading,
  rightElement,
  children,
  defaultValue,
}: PropsWithChildren<{
  textRef: MutableRefObject<HTMLParagraphElement>
  isLoading?: boolean
  rightElement?: ReactNode
  defaultValue?: string
}>) => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls()
  const {
    resetField,
    formState: { errors },
  } = useFormContext<RequirementNameForm>()

  if (isEditing)
    return (
      <Box
        data-req-name-editor
        borderWidth={1}
        borderRadius="lg"
        display={"flex"}
        pl={2}
        overflow={"hidden"}
      >
        <EditableInput
          _focus={{
            boxShadow: "none",
          }}
          p={0}
          borderRadius={0}
        />

        <Tooltip
          label={errors.customName?.message}
          isDisabled={isEditing && !errors.customName}
          hasArrow
        >
          <IconButton
            size="xs"
            variant="ghost"
            borderRadius={0}
            aria-label="Edit"
            icon={<Check />}
            colorScheme={"green"}
            {...getSubmitButtonProps()}
            isDisabled={isEditing && !!errors.customName}
          />
        </Tooltip>
      </Box>
    )

  return (
    <Text wordBreak="break-word" ref={textRef}>
      {children}

      <IconButton
        size="xs"
        variant="ghost"
        ml={0.5}
        mt={-0.5}
        aria-label="Save"
        icon={<PencilSimple />}
        color="gray"
        {...getEditButtonProps({
          onClick: () => {
            resetField("customName", {
              defaultValue: !!defaultValue
                ? defaultValue
                : textRef.current?.textContent,
              keepDirty: true,
            })
          },
          isLoading,
        })}
      />
      {rightElement}
    </Text>
  )
}

type RequirementNameEditorProps = {
  onSave: (customName: string) => void
  isLoading?: boolean
  rightElement?: ReactNode
}

const RequirementNameEditorWrapper = ({
  onSave,
  isLoading,
  rightElement,
  children,
}: PropsWithChildren<RequirementNameEditorProps>) => {
  const methods = useForm<RequirementNameForm>({
    mode: "all",
  })
  const requirement = useRequirementContext()
  const {
    type,
    data: { customName },
  } = requirement

  const textRef = useRef<HTMLParagraphElement>(null)
  const {
    field,
    formState: { errors },
  } = useController({
    control: methods.control,
    name: "customName",
    rules: REQUIREMENTS[type].customNameRules,
    shouldUnregister: true,
  })

  const { resetField } = useFormContext()

  const conditionallyResetToOriginal = (value) => {
    if (value === customName || value.trim() === "") {
      resetField("customName", {
        defaultValue: customName,
        keepDirty: true,
      })
    }
  }

  const errorToast = useShowErrorToast()

  const handleSubmit = (name: string) => {
    if (!!errors?.customName) {
      errorToast(errors.customName.message as string)
      return
    }
    onSave(name)
  }

  return (
    <FormProvider {...methods}>
      <Editable
        size="sm"
        {...field}
        onSubmit={handleSubmit}
        onCancel={conditionallyResetToOriginal}
      >
        <RequirementNameEditor
          textRef={textRef}
          isLoading={isLoading}
          rightElement={rightElement}
          defaultValue={customName}
        >
          {children}
        </RequirementNameEditor>
      </Editable>
    </FormProvider>
  )
}

export default RequirementNameEditorWrapper
