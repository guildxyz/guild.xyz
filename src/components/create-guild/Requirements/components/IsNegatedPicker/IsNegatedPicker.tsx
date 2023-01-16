import { ButtonGroup, useRadioGroup } from "@chakra-ui/react"
import { useController, useFormContext } from "react-hook-form"
import IsNegatedOption from "./components/IsNegatedOption"

const options = [
  {
    label: "Should satisfy",
    value: false,
    colorScheme: "green",
  },
  {
    label: (
      <>
        Should <b>not</b> satisfy
      </>
    ),
    value: true,
    colorScheme: "red",
  },
]

const IsNegatedPicker = ({ baseFieldPath }) => {
  const { control } = useFormContext()

  const { field } = useController({
    control,
    name: `${baseFieldPath}.isNegated`,
    defaultValue: false,
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: `${baseFieldPath}.isNegated`,
    onChange: (newValue) => {
      field.onChange(newValue === "true")
    },
    value: field.value,
  })

  const group = getRootProps()

  return (
    <ButtonGroup size="sm" mb="6" w="full" {...group}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value })
        return <IsNegatedOption key={option.value} {...radio} {...option} />
      })}
    </ButtonGroup>
  )
}

export default IsNegatedPicker
