import { FormControl, FormLabel, InputGroup } from "@chakra-ui/react"
import { Select } from "components/common/ChakraReactSelect"
import { RPC, supportedChains as defaultSupportedChains } from "connectors"
import { Controller, useWatch } from "react-hook-form"
import { SupportedChains } from "temporaryData/types"
import Symbol from "./Symbol"

type Props = {
  controlName: string
  defaultChain: SupportedChains
  supportedChains?: Array<SupportedChains>
}

const mappedChains: Array<{ img: string; label: string; value: SupportedChains }> =
  defaultSupportedChains.map((chainName: SupportedChains) => ({
    img: RPC[chainName]?.iconUrls?.[0] || "",
    label: chainName,
    value: chainName,
  }))

const ChainPicker = ({
  controlName,
  defaultChain,
  supportedChains,
}: Props): JSX.Element => {
  const chain = useWatch({ name: controlName })

  return (
    <FormControl isRequired pb={4} borderColor="gray.600" borderBottomWidth={1}>
      <FormLabel>Chain</FormLabel>
      <InputGroup>
        <Symbol symbol={RPC[chain]?.iconUrls?.[0]} />
        <Controller
          name={controlName}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              ref={ref}
              options={
                supportedChains
                  ? mappedChains.filter((_chain) =>
                      supportedChains.includes(_chain.value)
                    )
                  : mappedChains
              }
              value={mappedChains.find((_chain) => _chain.value === value)}
              defaultValue={
                mappedChains.find((_chain) => _chain.value === defaultChain) ||
                mappedChains[0]
              }
              onChange={(selectedOption) => onChange(selectedOption?.value)}
              onBlur={onBlur}
            />
          )}
        />
      </InputGroup>
    </FormControl>
  )
}

export default ChainPicker
