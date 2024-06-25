import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  HStack,
  Input,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Stack,
  forwardRef,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"

type Props = {
  field: Schemas["Field"] | CreateForm["fields"][number]
}

const SingleChoice = forwardRef<Props & Omit<RadioGroupProps, "children">, "div">(
  ({ field, value, onChange, ...props }, _ref) => {
    // We probably won't run into this case, but needed to add this line to get valid intellisense
    if (field.type !== "SINGLE_CHOICE") return null

    const options = field.options.map((option) =>
      typeof option === "number" || typeof option === "string"
        ? option
        : option.value
    )

    const isOtherActive =
      value !== undefined && value !== null && !options.includes(value)

    return (
      <RadioGroup
        {...props}
        value={value}
        onChange={onChange}
        colorScheme={"primary"}
      >
        <Stack spacing={2}>
          {options.map((option) => (
            <Radio key={option} value={option.toString()} w="max-content">
              {option}
            </Radio>
          ))}

          {field.allowOther && (
            <HStack>
              <Radio
                isDisabled={props.isDisabled}
                isChecked={isOtherActive}
                // so clicking the marker will focus the input automatically
                {...(!props.isDisabled && {
                  as: "label",
                  for: `field_${field.id}_other`,
                  cursor: "pointer",
                })}
              ></Radio>
              <Input
                id={`field_${field.id}_other`}
                isDisabled={props.isDisabled}
                placeholder="Other..."
                onChange={(e) => {
                  onChange(e.target.value)
                }}
                value={isOtherActive ? value : ""}
                {...(!isOtherActive
                  ? {
                      variant: "unstyled",
                      height: "1.5em",
                      className: "disabledOtherInput", // so we can handle to keep it's opacity in ResponseModal
                    }
                  : {})}
                onFocus={() => {
                  if (!isOtherActive) onChange("")
                }}
                transition={"padding .15s, height .15s"}
              />
            </HStack>
          )}
        </Stack>
      </RadioGroup>
    )
  }
)

const MultipleChoice = forwardRef<Props & CheckboxGroupProps, "div">(
  ({ field, value: valuesArray, onChange, ...props }, _ref) => {
    // We probably won't run into this case, but needed to add this line to get valid intellisense
    if (field.type !== "MULTIPLE_CHOICE") return null

    const options = field.options.map((option) =>
      typeof option === "number" || typeof option === "string"
        ? option
        : option.value
    )

    const otherValue = valuesArray?.find((v) => !options.includes(v))

    return (
      <CheckboxGroup
        {...props}
        value={valuesArray}
        onChange={onChange}
        colorScheme={"primary"}
      >
        <Stack spacing={2}>
          {options.map((option) => (
            <Checkbox key={option} value={option.toString()} w="max-content">
              {option}
            </Checkbox>
          ))}

          {field.allowOther && (
            <HStack>
              <Checkbox
                isDisabled={props.isDisabled}
                isChecked={otherValue !== undefined}
                // so clicking the marker will focus the input automatically, or remove the other option as expected
                {...(!props.isDisabled && !otherValue
                  ? {
                      as: "label",
                      for: `field_${field.id}_other`,
                      cursor: "pointer",
                    }
                  : {})}
                value={otherValue}
              ></Checkbox>
              <Input
                id={`field_${field.id}_other`}
                isDisabled={props.isDisabled}
                placeholder="Other..."
                onChange={(e) => {
                  const otherValueIndex = valuesArray.indexOf(otherValue)
                  valuesArray[otherValueIndex] = e.target.value
                  onChange(valuesArray)
                }}
                onBlur={(e) => {
                  if (e.target.value === "")
                    onChange(valuesArray.filter((v) => v !== otherValue))
                }}
                value={otherValue || ""}
                {...(otherValue === undefined
                  ? {
                      variant: "unstyled",
                      height: "1.5em",
                      className: "disabledOtherInput", // so we can handle to keep it's opacity in ResponseModal
                    }
                  : {})}
                onFocus={() => {
                  if (!otherValue) onChange([...(valuesArray ?? []), ""])
                }}
                transition={"padding .15s, height .15s"}
              />
            </HStack>
          )}
        </Stack>
      </CheckboxGroup>
    )
  }
)

export { MultipleChoice, SingleChoice }
