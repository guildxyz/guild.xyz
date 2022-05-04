import { Box, useRadio, useRadioGroup, UseRadioProps, Wrap } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { useController } from "react-hook-form"

const options = [
  {
    value: "NEVER",
    text: "never",
  },
  {
    value: "INSTANT",
    text: "instantly",
  },
  {
    value: "SLOW",
    text: "in 7 days",
  },
]

const Option = ({ children, ...props }: PropsWithChildren<UseRadioProps>) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="lg"
        _checked={{
          bg: "DISCORD.500",
          color: "white",
          borderColor: "DISCORD.500",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={3}
        py={2}
      >
        {children}
      </Box>
    </Box>
  )
}

const UnauthenticatedOptions = () => {
  const { field: activationIntervalField } = useController({
    name: "activationInterval",
  })
  const { field: includeUnauthenticatedField } = useController({
    name: "includeUnauthenticated",
  })

  const { getRootProps, getRadioProps, value } = useRadioGroup({
    onChange: (newValue) => {
      activationIntervalField.onChange(+(newValue === "SLOW") * 7)
      includeUnauthenticatedField.onChange(newValue !== "NEVER")
    },
    value:
      (!includeUnauthenticatedField.value && "NEVER") ||
      (activationIntervalField.value === 0 && "INSTANT") ||
      "SLOW",
  })

  const group = getRootProps()

  return (
    <Wrap {...group}>
      {options.map(({ value: optionValue, text }) => {
        const radio = getRadioProps({ value: optionValue })
        return (
          <Option key={optionValue} {...radio}>
            {text}
          </Option>
        )
      })}
    </Wrap>
  )
}

export default UnauthenticatedOptions
