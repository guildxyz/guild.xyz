import { useController, UseControllerProps } from "react-hook-form"
import { SelectOption } from "types"
import StyledSelect from "./StyledSelect"
import { StyledSelectProps } from "./StyledSelect/StyledSelect"

type Props = {
  rules?: Record<string, any>
  beforeOnChange?: (newValue: SelectOption) => void
  afterOnChange?: (newValue: SelectOption) => void
  fallbackValue?: SelectOption<any> // TODO: we could use a generic here & infer the type from the "options" prop
} & StyledSelectProps &
  UseControllerProps

const ControlledSelect = ({
  control,
  name: nameProp,
  rules,
  beforeOnChange,
  afterOnChange,
  options,
  defaultValue,
  fallbackValue,
  isCopyable,
  ...rest
}: Props): JSX.Element => {
  const {
    field: { ref, name, value, onChange, onBlur },
  } = useController({
    control,
    name: nameProp,
    rules,
    defaultValue,
  })

  return (
    <StyledSelect
      ref={ref}
      name={name}
      options={options}
      defaultValue={options?.find(
        (option: SelectOption) => option.value === defaultValue
      )}
      value={
        options?.find((option: SelectOption) => option.value === value) ??
        fallbackValue ??
        null
      }
      onChange={(newValue: SelectOption) => {
        beforeOnChange?.(newValue)
        onChange(newValue?.value ?? null)
        afterOnChange?.(newValue)
      }}
      onBlur={onBlur}
      isCopyable={isCopyable}
      {...rest}
    />
  )
}

export default ControlledSelect
