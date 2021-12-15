import { FormControl, FormLabel, InputGroup, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Select } from "components/common/ChakraReactSelect"
import { Chains, RPC, supportedChains as defaultSupportedChains } from "connectors"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { SupportedChains } from "types"
import Symbol from "./Symbol"

type Props = {
  controlName: string
  defaultChain: SupportedChains
  supportedChains?: Array<SupportedChains>
  onChange?: () => void
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
  supportedChains = defaultSupportedChains as Array<SupportedChains>,
  onChange: onChangeHandler,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { setValue } = useFormContext()

  const { chainId } = useWeb3React()
  const chain = useWatch({ name: controlName })

  const mappedSupportedChains = useMemo(
    () =>
      supportedChains
        ? mappedChains?.filter((_chain) => supportedChains.includes(_chain.value))
        : mappedChains,
    [supportedChains]
  )

  // If default chain is null (create page), the ChainPicker component will use the user's current chain (if it's supported in the requirement) or ETHEREUM. Otherwise (edit page), it'll use the provided default chain
  useEffect(() => {
    if (chain) return
    setValue(
      controlName,
      supportedChains.includes(Chains[chainId] as SupportedChains)
        ? Chains[chainId]
        : "ETHEREUM"
    )
  }, [chainId])

  return (
    <FormControl
      isRequired
      pb={4}
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      borderBottomWidth={1}
    >
      <FormLabel>Chain</FormLabel>
      <InputGroup>
        <Symbol symbol={RPC[chain]?.iconUrls?.[0]} />
        <Controller
          name={controlName}
          defaultValue={defaultChain}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              ref={ref}
              options={mappedSupportedChains}
              value={mappedSupportedChains?.find((_chain) => _chain.value === value)}
              onChange={(selectedOption) => {
                onChange(selectedOption?.value)
                onChangeHandler?.()
              }}
              onBlur={onBlur}
            />
          )}
        />
      </InputGroup>
    </FormControl>
  )
}

export default ChainPicker
