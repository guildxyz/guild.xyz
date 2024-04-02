import {
  Box,
  Editable,
  EditableInput,
  IconButton,
  Text,
  Tooltip,
  useEditableContext,
} from "@chakra-ui/react"
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
  const { isEditing, getInputProps, getSubmitButtonProps, getEditButtonProps } =
    useEditableContext()
  const {
    resetField,
    formState: { errors },
  } = useFormContext<RequirementNameForm>()

  if (isEditing)
    return (
      <Tooltip
        label={errors.customName?.message}
        hasArrow
        isOpen={!!errors.customName}
      >
        <Box
          data-req-name-editor
          borderWidth={1}
          borderRadius="lg"
          display="flex"
          pl={2}
          overflow="hidden"
        >
          <EditableInput
            {...getInputProps({
              onKeyDown: (e) => {
                if (!!errors?.customName && e.key === "Enter") {
                  e.preventDefault()
                }
              },
            })}
            _focus={{
              boxShadow: "none",
            }}
            p={0}
            borderRadius={0}
          />

          <IconButton
            size="xs"
            variant="ghost"
            borderRadius={0}
            aria-label="Edit"
            icon={<Check />}
            colorScheme={"green"}
            {...getSubmitButtonProps({
              onClick: (e) => {
                if (!!errors.customName) e.preventDefault()
              },
            })}
            isDisabled={isEditing && !!errors.customName}
          />
        </Box>
      </Tooltip>
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
  const { type, data } = requirement

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
    if (value === data?.customName || value.trim() === "") {
      resetField("customName", {
        defaultValue: data?.customName,
        keepDirty: true,
      })
    }
  }

  const handleSubmit = (name: string) => {
    if (!!errors?.customName) {
      return
    }
    onSave(name)
  }

  return (
    <FormProvider {...methods}>
      <Editable
        size="sm"
        {...field}
        submitOnBlur={false}
        onSubmit={handleSubmit}
        onCancel={conditionallyResetToOriginal}
        w="full"
      >
        <RequirementNameEditor
          textRef={textRef}
          isLoading={isLoading}
          rightElement={rightElement}
          defaultValue={data?.customName}
        >
          {children}
        </RequirementNameEditor>
      </Editable>
    </FormProvider>
  )
}

export default RequirementNameEditorWrapper
