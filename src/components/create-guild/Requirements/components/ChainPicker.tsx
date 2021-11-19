import { FormControl, FormLabel } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Select from "components/common/ChakraReactSelect"
import { Chains, supportedChains } from "connectors"
import { Controller, useFormContext } from "react-hook-form"

type Props = {
  controlName: string
}

const OPTIONS = supportedChains.map((chainName) => ({
  label: chainName,
  value: chainName,
}))

const ChainPicker = ({ controlName }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
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
        defaultValue={
          OPTIONS.find((option) => option.value === Chains[chainId])?.value ||
          OPTIONS[0].value
        }
        render={({ field: { onChange, ref } }) => (
          <Select
            inputRef={ref}
            options={OPTIONS}
            defaultValue={
              OPTIONS.find((option) => option.value === Chains[chainId]) ||
              OPTIONS[0]
            }
            onChange={(newValue) => onChange(newValue.value)}
          />
        )}
      />
    </FormControl>
  )
}

export default ChainPicker
