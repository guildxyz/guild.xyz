import { FormControl, FormLabel, SimpleGrid, useRadioGroup } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormContext } from "react-hook-form"
import And from "static/logicIcons/and.svg"
import Or from "static/logicIcons/or.svg"
import { GuildFormType } from "types"
import LogicOption from "./components/LogicOption"

const options = [
  {
    value: "AND",
    icon: And,
  },
  {
    value: "OR",
    icon: Or,
  },
]

const BalancyLogicPicker = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const { field } = useController({
    control,
    name: "logic",
    rules: { required: "You must pick a logic for your role requirements" },
    defaultValue: "AND",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "logic",
    onChange: field.onChange,
    value: field.value,
    defaultValue: "AND",
  })

  const group = getRootProps()

  return (
    <FormControl isInvalid={!!errors?.logic}>
      <FormLabel>Requirements logic</FormLabel>
      <SimpleGrid {...group} columns={{ base: 2, sm: 4 }} gap={{ base: 2, md: 5 }}>
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value })
          return <LogicOption key={option.value} {...radio} {...option} />
        })}
      </SimpleGrid>
      <FormErrorMessage>{errors?.logic?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default BalancyLogicPicker
