import {
  Divider,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ControlledSelect from "components/common/ControlledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { BALANCY_SUPPORTED_CHAINS } from "components/create-guild/Requirements/hooks/useBalancy"
import {
  Chain,
  Chains,
  RPC,
  supportedChains as defaultSupportedChains,
} from "connectors"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  controlName: string
  supportedChains?: Array<Chain>
  onChange?: () => void
  isDisabled?: boolean
  showDivider?: boolean
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
  showDivider = true,
}: Props): JSX.Element => {
  const router = useRouter()
  const isBalancyPlayground = router.asPath === "/balancy"

  const { setValue } = useFormContext()

  const { chainId } = useWeb3React()
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
      <FormControl isRequired isDisabled={isDisabled}>
        <FormLabel>Chain</FormLabel>
        <InputGroup>
          <InputLeftElement>
            <OptionImage img={RPC[chain]?.iconUrls?.[0]} alt={chain} />
          </InputLeftElement>

          <ControlledSelect
            name={controlName}
            options={mappedSupportedChains}
            afterOnChange={onChangeHandler}
          />
        </InputGroup>
      </FormControl>
      {showDivider && <Divider />}
    </>
  )
}

export default ChainPicker
