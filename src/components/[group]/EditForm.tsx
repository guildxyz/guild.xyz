import { VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import Section from "components/common/Section"
import GuildPicker from "components/create-group/GuildPicker"
import NameAndIcon from "components/create/NameAndIcon"

const EditForm = () => {
  const { account } = useWeb3React()

  if (!account) return <ConnectWalletAlert />

  return (
    <VStack mt={8} spacing={10} alignItems="start">
      <Section title="Choose a logo and name for your Group">
        <NameAndIcon />
      </Section>

      <GuildPicker />
    </VStack>
  )
}

export default EditForm
