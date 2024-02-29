import {
  Box,
  Editable,
  EditableInput,
  IconButton,
  Text,
  Tooltip,
  useEditableControls,
} from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { Check, PencilSimple } from "phosphor-react"
import {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import REQUIREMENTS from "requirements"
import { useRequirementContext } from "./RequirementContext"

type RequirementNameForm = {
  customName?: string
}

const RequirementNameEditor = ({
  textRef,
  isLoading,
  children,
}: PropsWithChildren<{
  textRef: MutableRefObject<HTMLParagraphElement>
  isLoading?: boolean
}>) => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls()
  const {
    resetField,
    formState: { errors },
  } = useFormContext<RequirementNameForm>()

  const customName = useWatch({ name: "customName" })

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
            /**
             * The "LINK_VISIT" requirement will have a custom value by default, with
             * a special variable ([link title]) in it, so we don't want to reset it
             * to textRef.current.textContent
             */
            if (!!customName) return
            resetField("customName", {
              defaultValue: textRef.current?.textContent,
              keepDirty: true,
            })
          },
          isLoading,
        })}
      />
      <SetVisibility entityType="requirement" mt={-0.5} />
    </Text>
  )
}

export type RequirementNameEditorProps = {
  onSave?: (newName: string) => void
}

const RequirementNameEditorWrapper = ({
  onSave,
  children,
}: PropsWithChildren<RequirementNameEditorProps>) => {
  const methods = useForm<RequirementNameForm>({
    mode: "all",
  })
  const requirement = useRequirementContext()
  const { id, roleId, type } = requirement

  const textRef = useRef<HTMLParagraphElement>(null)
  const [originalValue, setOriginalValue] = useState("")
  const { field } = useController({
    control: methods.control,
    name: "customName",
    rules: REQUIREMENTS[type].customNameRules,
    shouldUnregister: true,
  })

  useEffect(() => {
    if (!textRef.current) return

    if (!!field.value && !originalValue) {
      setOriginalValue(field.value)
    } else {
      setOriginalValue(textRef.current.textContent)
    }
  }, [textRef.current, originalValue, field.value])

  const { resetField } = useFormContext()

  const conditionallyResetToOriginal = (value) => {
    if (value === originalValue || value.trim() === "") {
      resetField("customName", {
        defaultValue: originalValue,
        keepDirty: true,
      })
    }
  }

  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(roleId)

  const onSubmit = (customName: string) => {
    if (id && roleId) {
      if (field.value === originalValue) return

      onEditRequirementSubmit({
        ...requirement,
        data: {
          ...requirement.data,
          customName,
        },
      })
      return
    }

    onSave?.(customName)
  }

  return (
    <FormProvider {...methods}>
      <Editable
        size="sm"
        {...field}
        onSubmit={onSubmit}
        onCancel={conditionallyResetToOriginal}
      >
        <RequirementNameEditor
          textRef={textRef}
          isLoading={isEditRequirementLoading}
        >
          {children}
        </RequirementNameEditor>
      </Editable>
    </FormProvider>
  )
}

export default RequirementNameEditorWrapper
