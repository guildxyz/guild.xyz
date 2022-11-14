import {
  Divider,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import {
  Chain,
  Chains,
  RPC,
  supportedChains as defaultSupportedChains,
} from "connectors"
import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { SelectOption } from "types"

type Props = {
  controlName: string
  supportedChains?: Array<Chain>
  onChange?: () => void
  isDisabled?: boolean
}

const mappedChains: Array<{ img: string; label: string; value: Chain }> =
  defaultSupportedChains.map((chainName: Chain) => ({
    img: RPC[chainName]?.iconUrls?.[0] || "",
    label: RPC[chainName]?.chainName,
    value: chainName,
  }))

const ChainPicker = ({
  controlName,
  supportedChains = defaultSupportedChains,
  onChange: onChangeHandler,
  isDisabled,
}: Props): JSX.Element => {
  const { setValue } = useFormContext()

  const { chainId } = useWeb3React()
  const chain = useWatch({ name: controlName })

  const mappedSupportedChains = supportedChains
    ? mappedChains?.filter((_chain) => supportedChains.includes(_chain.value))
    : mappedChains

  /**
   * Timeouted setValue on mount instead of defaultValue, because for some reason
   * useWatch({ name: `${baseFieldPath}.chain` }) in other components returns
   * undefined before selecting an option otherways
   */
  useEffect(() => {
    if (chain) return

    setTimeout(() => {
      setValue(
        controlName,
        supportedChains.includes(Chains[chainId] as Chain)
          ? Chains[chainId]
          : supportedChains[0]
      )
    }, 0)
  }, [chainId])

  return (
    <>
      <FormControl isRequired isDisabled={isDisabled}>
        <FormLabel>Chain</FormLabel>
        <InputGroup>
          <InputLeftElement>
            <OptionImage img={RPC[chain]?.iconUrls?.[0]} alt={chain} />
          </InputLeftElement>
          <Controller
            name={controlName}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                options={mappedSupportedChains}
                value={mappedSupportedChains?.find(
                  (_chain) => _chain.value === value
                )}
                onChange={(selectedOption: SelectOption) => {
                  onChange(selectedOption?.value)
                  onChangeHandler?.()
                }}
                onBlur={onBlur}
              />
            )}
          />
        </InputGroup>
      </FormControl>
      <Divider />
    </>
  )
}

export default ChainPicker
