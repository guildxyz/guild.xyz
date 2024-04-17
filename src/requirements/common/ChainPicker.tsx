import {
  Divider,
  FormControl,
  FormLabel,
  Icon,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { StyledSelectProps } from "components/common/StyledSelect/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Question } from "phosphor-react"
import { useController } from "react-hook-form"
import { useChainId } from "wagmi"
import {
  CHAIN_CONFIG,
  Chain,
  Chains,
  supportedChains as defaultSupportedChains,
} from "wagmiConfig/chains"

const FUEL_ICON = "/walletLogos/fuel.svg"

type Props = {
  controlName: string
  supportedChains?: Array<Chain | "FUEL">
  onChange?: () => void
  isDisabled?: boolean
  showDivider?: boolean
  menuPlacement?: StyledSelectProps["menuPlacement"]
}

const mappedChains: Array<{
  img: string | JSX.Element
  label: string
  value: Chain | "FUEL"
  isDisabled?: boolean
  details?: string
}> = defaultSupportedChains
  .map((chainName: Chain) => ({
    img: CHAIN_CONFIG[chainName].iconUrl || <Icon as={Question} boxSize={5} />,
    label: CHAIN_CONFIG[chainName].name,
    value: chainName,
    isDisabled: CHAIN_CONFIG[chainName].deprecated,
    details: CHAIN_CONFIG[chainName].deprecated ? "Deprecated" : undefined,
  }))
  .concat([
    {
      img: FUEL_ICON,
      label: "Fuel",
      value: "FUEL" as any,
      isDisabled: false,
      details: undefined,
    },
  ])

const ChainPicker = ({
  controlName,
  supportedChains = defaultSupportedChains,
  onChange: onChangeHandler,
  isDisabled,
  showDivider = true,
  menuPlacement = "bottom", // auto doesn't really work for some reason...
}: Props): JSX.Element => {
  const chainId = useChainId()

  const mappedSupportedChains = supportedChains
    ? mappedChains?.filter((_chain) => supportedChains.includes(_chain.value))
    : mappedChains

  const {
    field: { value: chain },
  } = useController({
    name: controlName,
    defaultValue: supportedChains.includes(Chains[chainId] as Chain)
      ? Chains[chainId]
      : supportedChains[0],
  })

  return (
    <>
      <FormControl>
        <FormLabel>Chain</FormLabel>
        <InputGroup>
          {(CHAIN_CONFIG[chain]?.iconUrl || chain === "FUEL") && (
            <InputLeftElement>
              <OptionImage
                img={chain === "FUEL" ? FUEL_ICON : CHAIN_CONFIG[chain]?.iconUrl}
                alt={chain}
              />
            </InputLeftElement>
          )}

          <ControlledSelect
            name={controlName}
            options={mappedSupportedChains}
            afterOnChange={onChangeHandler}
            isDisabled={isDisabled}
            data-test="chain-picker-input"
            menuPlacement={menuPlacement}
          />
        </InputGroup>
      </FormControl>
      {showDivider && <Divider />}
    </>
  )
}

export default ChainPicker
