import { FormControl, FormLabel, InputGroup } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Select } from "components/common/ChakraReactSelect"
import { Chains, RPC, supportedChains } from "connectors"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import Symbol from "./Symbol"

type Props = {
  controlName: string
}

const OPTIONS = supportedChains.map((chainName) => ({
  img: RPC[chainName]?.iconUrls?.[0] || "",
  label: chainName,
  value: chainName,
}))

const ChainPicker = ({ controlName }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
  const { control } = useFormContext()

  const chain = useWatch({ name: controlName })

  return (
    <FormControl isRequired pb={4} borderColor="gray.600" borderBottomWidth={1}>
      <FormLabel>Chain</FormLabel>
      <InputGroup>
        <Symbol symbol={RPC[chain]?.iconUrls?.[0]} />
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
          render={({ field: { onChange, ref, value } }) => (
            <Select
              inputRef={ref}
              options={OPTIONS}
              defaultValue={
                OPTIONS.find((option) => option.value === Chains[chainId]) ||
                OPTIONS[0]
              }
              value={OPTIONS.find((option) => option.value === value)}
              onChange={(newValue) => onChange(newValue.value)}
            />
          )}
        />
      </InputGroup>
    </FormControl>
  )
}

export default ChainPicker
