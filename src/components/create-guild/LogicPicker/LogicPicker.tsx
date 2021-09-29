import {
  FormControl,
  FormErrorMessage,
  SimpleGrid,
  useRadioGroup,
} from "@chakra-ui/react"
import { useController, useFormContext } from "react-hook-form"
import LogicOption from "./components/LogicOption"

const options = [
  {
    value: "AND",
    disabled: false,
  },
  {
    value: "OR",
    disabled: false,
  },
  {
    value: "NOR",
    disabled: true,
  },
  {
    value: "NAND",
    disabled: true,
  },
]

const LogicPicker = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { field } = useController({
    control,
    name: "logic",
    rules: { required: "You must pick a logic for your guild requirements" },
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "logic",
    onChange: field.onChange,
    value: field.value,
    defaultValue: "AND",
  })

  const group = getRootProps()

  return (
    <FormControl isRequired isInvalid={errors?.logic}>
      <SimpleGrid {...group} columns={4} gap={{ base: 2, md: 4 }}>
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value })
          return <LogicOption key={option.value} {...radio} {...option} />
        })}
      </SimpleGrid>
      <FormErrorMessage>{errors?.logic?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default LogicPicker
