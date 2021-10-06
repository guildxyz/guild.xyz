import { IconButton, useRadio } from "@chakra-ui/react"

const SelectorButton = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { value, isChecked } = props

  return (
    <>
      <input {...input} />
      <IconButton
        as="label"
        {...checkbox}
        htmlFor={input.id}
        cursor="pointer"
        icon={<img src={value} />}
        aria-label="Logo option"
        colorScheme={isChecked ? "green" : "gray"}
      />
    </>
  )
}

export default SelectorButton
