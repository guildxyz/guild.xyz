import { Checkbox } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { Chains } from "connectors"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"

const TOSCheckbox = (): JSX.Element => {
  const { name } = useGuild()

  const { chain } = useRequirementContext()
  const { agreeWithTOS, setAgreeWithTOS } = useGuildCheckoutContext()

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
      {`I understand that I purchase this asset from exchanges, not from 
      ${name} or guild.xyz itself`}
    </Checkbox>
  )
}

export default TOSCheckbox
