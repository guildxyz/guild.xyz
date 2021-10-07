import { IconButton, useColorMode, useRadio } from "@chakra-ui/react"

const SelectorButton = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { value, isChecked } = props

  const { colorMode } = useColorMode()

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
        colorScheme={isChecked ? "indigo" : "gray"}
        boxSize={10}
        minW={10}
        minH={10}
        rounded="full"
      />
    </>
  )
}

export default SelectorButton
