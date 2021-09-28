import { Button, useRadio } from "@chakra-ui/react"

const LogicOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { value, disabled = false, isChecked } = props

  if (disabled)
    return (
      <Button disabled _active={{ bg: null }}>
        {value}
      </Button>
    )

  return (
    <Button
      as="label"
      {...checkbox}
      bgColor={isChecked ? "whiteAlpha.300" : "whiteAlpha.200"}
      boxShadow="none !important"
      _hover={{ bgColor: "whiteAlpha.300" }}
      borderWidth={isChecked ? 2 : 0}
      _active={{ bg: null }}
    >
      <input {...input} />
      {value}
    </Button>
  )
}

export default LogicOption
