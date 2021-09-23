import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import { useFormContext } from "react-hook-form"

const LogicPicker = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const options = ["AND", "OR", "NOR", "NAND"]

  return (
    <>
      <FormControl maxWidth={60} isRequired isInvalid={errors?.logic}>
        <Select
          options={options.map((option) => ({ label: option, value: option }))}
          defaultValue={{ label: options[0], value: options[0] }}
        />
        <Input
          type="hidden"
          {...register("logic", {
            required: "You must pick a logic for your guild requirements",
          })}
          defaultValue={options[0]}
        />
        <FormErrorMessage>{errors?.logic?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}

export default LogicPicker
