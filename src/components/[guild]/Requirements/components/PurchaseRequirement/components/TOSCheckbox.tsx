import { Checkbox } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import { useRequirementContext } from "../../RequirementContext"
import { usePurchaseRequirementContext } from "./PurchaseRequirementContex"

const TOSCheckbox = (): JSX.Element => {
  const { chain } = useRequirementContext()
  const { agreeWithTOS, setAgreeWithTOS } = usePurchaseRequirementContext()

  const requirementChainId = Chains[chain]
  const { chainId } = useWeb3React()

  if (chainId !== requirementChainId) return null

  return (
    <Checkbox
      alignItems="start"
      sx={{
        "> .chakra-checkbox__control": {
          marginTop: 1,
          borderWidth: 1,
        },
      }}
      _checked={{
        "> .chakra-checkbox__control[data-checked]": {
          bgColor: "blue.500",
          borderColor: "blue.500",
          color: "white",
        },
      }}
      pb={4}
      isChecked={agreeWithTOS}
      onChange={(e) => setAgreeWithTOS(e.target.checked)}
    >
      I understand that if the owner changes requirements & I could lose access.
    </Checkbox>
  )
}

export default TOSCheckbox
