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
      /**
       * We have the general "roles" parent column here, but have to set the filter
       * on the actual accessor leaf columns
       */
      column.getLeafColumns().map((leafColumn) =>
        leafColumn.setFilterValue((prevValue) => ({
          ...prevValue,
          logic: newValue,
        }))
      )
    },
    // the value will always be the same, so just getting the first leaf column's value
    value: (column.getLeafColumns()[0].getFilterValue() as any)?.logic,
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
