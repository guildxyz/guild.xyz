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
import { Check, PencilSimple } from "phosphor-react"
import {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import REQUIREMENTS from "requirements"
import parseFromObject from "utils/parseFromObject"
import slugify from "utils/slugify"
import { useRequirementContext } from "./RequirementContext"

const RequirementNameEditor = ({
  baseFieldPath,
  textRef,
  children,
}: PropsWithChildren<{
  baseFieldPath: string
  textRef: MutableRefObject<HTMLParagraphElement>
}>) => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls()
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const customName = useWatch({ name: `${baseFieldPath}.data.customName` })

  const highlightImageEditor = `
  #${slugify(baseFieldPath)} {
    opacity: 1 !important;
  }
  `

  if (isEditing)
    return (
      <>
        <style>{highlightImageEditor}</style>
        <Box
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
            label={
              parseFromObject(errors, `${baseFieldPath}.data.customName`)?.message
            }
            isDisabled={
              isEditing &&
              !parseFromObject(errors, `${baseFieldPath}.data.customName`)
            }
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
              isDisabled={
                isEditing &&
                !!parseFromObject(errors, `${baseFieldPath}.data.customName`)
              }
            />
          </Tooltip>
        </Box>
      </>
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
            resetField(`${baseFieldPath}.data.customName`, {
              defaultValue: textRef.current?.textContent,
              keepDirty: true,
            })
          },
        })}
      />
      <SetVisibility entityType="requirement" fieldBase={baseFieldPath} mt={-0.5} />
    </Text>
  )
}

const RequirementNameEditorWrapper = ({
  baseFieldPath,
  children,
}: PropsWithChildren<{ baseFieldPath: string }>) => {
  const { type } = useRequirementContext()

  const textRef = useRef<HTMLParagraphElement>(null)
  const [originalValue, setOriginalValue] = useState("")
  const { field } = useController({
    name: `${baseFieldPath}.data.customName`,
    rules: REQUIREMENTS[type].customNameRules,
  })

  useEffect(() => {
    if (!textRef.current) return

    if (!!field.value && !originalValue) {
      setOriginalValue(field.value)
      return
    } else {
      setOriginalValue(textRef.current.textContent)
    }
  }, [textRef.current, originalValue, field.value])

  const { resetField } = useFormContext()

  const conditionallyResetToOriginal = (value) => {
    if (value === originalValue || value.trim() === "") {
      resetField(`${baseFieldPath}.data.customName`, {
        defaultValue: originalValue,
        keepDirty: true,
      })
    }
  }

  return (
    <Editable
      size="sm"
      width="full"
      {...field}
      onSubmit={conditionallyResetToOriginal}
      onCancel={conditionallyResetToOriginal}
    >
      <RequirementNameEditor baseFieldPath={baseFieldPath} textRef={textRef}>
        {children}
      </RequirementNameEditor>
    </Editable>
  )
}

export default RequirementNameEditorWrapper
