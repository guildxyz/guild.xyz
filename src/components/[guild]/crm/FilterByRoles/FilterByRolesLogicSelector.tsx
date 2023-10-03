import { Button, ButtonGroup, Icon, useRadio, useRadioGroup } from "@chakra-ui/react"

const options = [
  {
    label: "Should satisfy some",
    value: "some",
  },
  {
    label: "Should satisfy all",
    value: "all",
  },
]

const FilterByRolesLogicSelector = ({ column }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    onChange: (newValue) => {
      column.setFilterValue((prevValue) => ({
        ...prevValue,
        logic: newValue,
      }))
    },
    value: (column.getFilterValue() as any)?.logic,
    defaultValue: "some",
  })

  const group = getRootProps()

  return (
    <ButtonGroup size="xs" mb="3" w="full" {...group} spacing={1.5}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value })
        return <LogicOption key={option.value} {...radio} {...option} />
      })}
    </ButtonGroup>
  )
}

const LogicOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { label, icon, isChecked, ...rest } = props

  return (
    <Button
      leftIcon={icon && <Icon as={icon} boxSize={5} />}
      as="label"
      {...checkbox}
      boxShadow="none !important"
      colorScheme={isChecked ? "indigo" : "gray"}
      borderRadius="md"
      w="full"
      cursor="pointer"
      {...rest}
    >
      <input {...input} />
      {label}
    </Button>
  )
}

export default FilterByRolesLogicSelector
