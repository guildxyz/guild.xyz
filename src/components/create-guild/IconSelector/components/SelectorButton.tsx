import { IconButton, useColorMode, useRadio } from "@chakra-ui/react"

const SelectorButton = (props) => {
  const { colorMode } = useColorMode()
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
        rounded="full"
        icon={<img src={value} />}
        aria-label="Logo option"
        colorScheme={isChecked ? "indigo" : "gray"}
        bgColor={!isChecked && colorMode === "light" && "gray.300"}
        boxSize={12}
      />
    </>
  )
}

export default SelectorButton
