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
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { Check, PencilSimple } from "phosphor-react"
import {
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
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
import { Requirement } from "types"
import { useRequirementContext } from "./RequirementContext"

type RequirementNameForm = {
  customName?: string
}

const RequirementNameEditor = ({
  textRef,
  isLoading,
  rightElement,
  children,
}: PropsWithChildren<{
  textRef: MutableRefObject<HTMLParagraphElement>
  isLoading?: boolean
  rightElement?: ReactNode
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
      {rightElement}
    </Text>
  )
}

export type RequirementNameAndVisibilityEditorProps = {
  onSave?: (editedData: Requirement) => void
}

const RequirementNameAndVisibilityEditor = ({
  onSave,
  children,
}: PropsWithChildren<RequirementNameAndVisibilityEditorProps>) => {
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

  const setVisibilityModalProps = useVisibilityModalProps()

  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(roleId, {
      onSuccess: () => setVisibilityModalProps.onClose(),
    })

  const onEditNameSubmit = (customName: string) => {
    const editedData = {
      ...requirement,
      data: {
        ...requirement.data,
        customName,
      },
    }

    onSubmit(editedData)
  }

  const onEditVisibilitySubmit = (visibilityData) => {
    const editedData = {
      ...requirement,
      ...visibilityData,
    }

    onSubmit(editedData)
  }

  const onSubmit = (req: Requirement) => {
    if (id && roleId) {
      if (field.value === originalValue) return

      onEditRequirementSubmit(req)
      return
    }

    onSave?.(req)
    setVisibilityModalProps.onClose()
  }

  return (
    <FormProvider {...methods}>
      <Editable
        size="sm"
        {...field}
        onSubmit={onEditNameSubmit}
        onCancel={conditionallyResetToOriginal}
      >
        <RequirementNameEditor
          textRef={textRef}
          isLoading={isEditRequirementLoading}
          rightElement={
            <SetVisibility
              entityType="requirement"
              mt={-0.5}
              defaultValues={{
                visibility: requirement.visibility,
                visibilityRoleId: requirement.visibilityRoleId,
              }}
              onSave={onEditVisibilitySubmit}
              isLoading={isEditRequirementLoading}
              {...setVisibilityModalProps}
            />
          }
        >
          {children}
        </RequirementNameEditor>
      </Editable>
    </FormProvider>
  )
}

export default RequirementNameAndVisibilityEditor
