import { Divider, useColorMode, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import DeleteCard from "components/common/DeleteCard"
import Section from "components/common/Section"
import GuildPicker from "components/create-group/GuildPicker"
import NameAndIcon from "components/create/NameAndIcon"

const EditForm = () => {
  const { account } = useWeb3React()
  const { colorMode } = useColorMode()

  if (!account) return <ConnectWalletAlert />

  return (
    <VStack mt={8} spacing={10} alignItems="start">
      <Section title="Choose a logo and name for your Hall">
        <NameAndIcon />
      </Section>

      <GuildPicker shouldHaveMaxHeight />

      <Divider borderColor={colorMode === "light" ? "blackAlpha.400" : undefined} />

      <DeleteCard />
    </VStack>
  )
}

export default EditForm
