import {
  Divider,
  FormControl,
  FormLabel,
  Icon,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import {
  CHAIN_CONFIG,
  Chain,
  Chains,
  supportedChains as defaultSupportedChains,
} from "chains"
import ControlledSelect from "components/common/ControlledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { BALANCY_SUPPORTED_CHAINS } from "components/create-guild/Requirements/hooks/useBalancy"
import { useRouter } from "next/router"
import { Question } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useChainId } from "wagmi"

const FUEL_ICON = "/walletLogos/fuel.svg"

type Props = {
  controlName: string
  supportedChains?: Array<Chain | "FUEL">
  onChange?: () => void
  isDisabled?: boolean
  showDivider?: boolean
}

const mappedChains: Array<{
  img: string | JSX.Element
  label: string
  value: Chain | "FUEL"
}> = defaultSupportedChains
  .map((chainName: Chain) => ({
    img: CHAIN_CONFIG[chainName].iconUrl || <Icon as={Question} boxSize={5} />,
    label: CHAIN_CONFIG[chainName].name,
    value: chainName,
  }))
  .concat([
    {
      img: FUEL_ICON,
      label: "Fuel",
      value: "FUEL" as any,
    },
  ])

const ChainPicker = ({
  controlName,
  supportedChains = defaultSupportedChains,
  onChange: onChangeHandler,
  isDisabled,
  showDivider = true,
}: Props): JSX.Element => {
  const router = useRouter()
  const isBalancyPlayground = router.asPath === "/balancy"

  const { setValue } = useFormContext()

  const chainId = useChainId()
  const chain = useWatch({ name: controlName })

  const mappedSupportedChains = isBalancyPlayground
    ? mappedChains.filter((c) =>
        Object.keys(BALANCY_SUPPORTED_CHAINS).includes(c.value)
      )
    : supportedChains
    ? mappedChains?.filter((_chain) => supportedChains.includes(_chain.value))
    : mappedChains

  /**
   * Timed out setValue on mount instead of defaultValue, because for some reason
   * useWatch({ name: `${baseFieldPath}.chain` }) in other components returns
   * undefined before selecting an option otherwise
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
          />
        </InputGroup>
      </FormControl>
      {showDivider && <Divider />}
    </>
  )
}

export default ChainPicker
