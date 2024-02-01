import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  CheckboxProps,
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioProps,
  Stack,
  forwardRef,
} from "@chakra-ui/react"
import { ComponentType } from "react"
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
  // We probably won't run into this case, but needed to add this line to get valid intellisense
  if (field.type !== "SINGLE_CHOICE" && field.type !== "MULTIPLE_CHOICE") return null

  const options = field.options.map((option) =>
    typeof option === "number" || typeof option === "string" ? option : option.value
  )

  const GroupComponent = GroupComponents[field.type]
  const FieldComponent = FieldComponents[field.type]

  return (
    <GroupComponent {...props}>
      <Stack spacing={1}>
        {options.map((option) => (
          <FieldComponent key={option} value={option.toString()}>
            {option}
          </FieldComponent>
        ))}
        {field.allowOther && (
          <FieldComponent value="Other...">Other...</FieldComponent>
        )}
      </Stack>
    </GroupComponent>
  )
})

export default Choice
