import { FormControl, FormLabel } from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect"
import { Controller, useFormContext } from "react-hook-form"

type Props = {
  controlName: string
}

const supportedChains = [
  "ETHEREUM",
  "BSC",
  "POLYGON",
  "AVALANCHE",
  "XDAI",
  "FANTOM",
  "ARBITRUM",
] // TODO: get these from connectors.ts
const OPTIONS = supportedChains.map((chainName) => ({
  label: chainName,
  value: chainName,
}))

const ChainPicker = ({ controlName }: Props): JSX.Element => {
  const { control } = useFormContext()

  return (
    <FormControl isRequired pb={4} borderColor="gray.600" borderBottomWidth={1}>
      <FormLabel>Chain</FormLabel>
      <Controller
        control={control}
        rules={{
          required: "This field is required.",
        }}
        name={controlName}
        defaultValue={OPTIONS[0].value}
        render={({ field: { onChange, ref } }) => (
          <Select
            inputRef={ref}
            options={OPTIONS}
            defaultValue={OPTIONS[0]}
            onChange={(newValue) => onChange(newValue.value)}
          />
        )}
      />
    </FormControl>
  )
}

export default ChainPicker
