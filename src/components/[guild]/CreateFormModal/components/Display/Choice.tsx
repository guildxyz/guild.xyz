import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  CheckboxProps,
  HStack,
  Input,
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioProps,
  Stack,
  forwardRef,
} from "@chakra-ui/react"
import { ComponentType, useState } from "react"
import { useFormContext } from "react-hook-form"
import { CreateFieldParams } from "../../schemas"

type Props = {
  field: CreateFieldParams
} & (RadioGroupProps | CheckboxGroupProps)

const GroupComponents: Record<
  "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
  ComponentType<RadioGroupProps | CheckboxGroupProps>
> = {
  SINGLE_CHOICE: RadioGroup,
  MULTIPLE_CHOICE: CheckboxGroup,
}

const FieldComponents: Record<
  "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
  ComponentType<RadioProps | CheckboxProps>
> = {
  SINGLE_CHOICE: Radio,
  MULTIPLE_CHOICE: Checkbox,
}

// TODO: should we pass that ref down? (probably for focus management?)
const Choice = forwardRef<Props, "div">(({ field, ...props }, _ref) => {
  const { setValue } = useFormContext()
  const [isOtherActive, setIsOtherActive] = useState(false)

  // We probably won't run into this case, but needed to add this line to get valid intellisense
  if (field.type !== "SINGLE_CHOICE" && field.type !== "MULTIPLE_CHOICE") return null

  const isSingleChoice = field.type === "SINGLE_CHOICE"

  const options = field.options.map((option) =>
    typeof option === "number" || typeof option === "string" ? option : option.value
  )

  const GroupComponent = GroupComponents[field.type]
  const FieldComponent = FieldComponents[field.type]

  return (
    <GroupComponent
      {...props}
      onChange={(newValue) => {
        if (newValue !== "Other...") {
          setIsOtherActive(false)
        }
        props.onChange(newValue)
      }}
    >
      <Stack spacing={1}>
        {options.map((option) => (
          <FieldComponent key={option} value={option.toString()} w="max-content">
            {option}
          </FieldComponent>
        ))}

        {field.allowOther && (
          <HStack>
            <FieldComponent
              isDisabled={props.isDisabled}
              isChecked={isOtherActive}
              onChange={(e) => {
                setIsOtherActive(e.target.checked)
                setValue(field.id, isSingleChoice ? "" : [])
              }}
            >
              {isSingleChoice && isOtherActive ? "" : "Other..."}
            </FieldComponent>
            {isSingleChoice && isOtherActive && (
              <Input
                as="input"
                placeholder="Other..."
                onChange={(e) => {
                  setValue(field.id, e.target.value)
                }}
              />
            )}
          </HStack>
        )}
      </Stack>
    </GroupComponent>
  )
})

export default Choice
