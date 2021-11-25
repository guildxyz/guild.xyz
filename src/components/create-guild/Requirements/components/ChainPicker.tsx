import { FormControl, FormLabel, InputGroup } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Select } from "components/common/ChakraReactSelect"
import { Chains, RPC, supportedChains } from "connectors"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
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
  const { register, setValue } = useFormContext()

  useEffect(() => {
    // Registering the input this way instead of using a Controller component (or useController), because some fields remained in the fieldsarray even after we removed them, which caused bugs in the application
    register(controlName, {
      required: "This field is required.",
      shouldUnregister: true,
    })
  }, [register])

  const chain = useWatch({ name: controlName })

  return (
    <FormControl isRequired pb={4} borderColor="gray.600" borderBottomWidth={1}>
      <FormLabel>Chain</FormLabel>
      <InputGroup>
        <Symbol symbol={RPC[chain]?.iconUrls?.[0]} />
        <Select
          options={OPTIONS}
          value={OPTIONS.find((option) => option.value === chain)}
          defaultValue={
            OPTIONS.find((option) => option.value === Chains[chainId])?.value ||
            OPTIONS[0].value
          }
          onChange={(newValue) => setValue(controlName, newValue?.value)}
        />
      </InputGroup>
    </FormControl>
  )
}

export default ChainPicker
