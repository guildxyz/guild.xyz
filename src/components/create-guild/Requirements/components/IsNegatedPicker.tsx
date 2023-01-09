import { ButtonGroup, useRadioGroup } from "@chakra-ui/react"
import RadioButton from "components/common/RadioButton"
import { useController, useFormContext } from "react-hook-form"

const options = [
  {
    label: "Should satisfy",
    value: false,
  },
  {
    label: (
      <>
        Should <b>not</b> satisfy
      </>
    ),
    value: true,
  },
]

const IsNegatedPicker = ({ baseFieldPath }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

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
        return (
          <RadioButton
            key={option.value}
            {...radio}
            {...option}
            borderRadius="md"
            w="full"
          />
        )
      })}
    </ButtonGroup>
  )
}

export default IsNegatedPicker
