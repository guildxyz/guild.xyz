import { Divider, useColorMode, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import DeleteCard from "components/common/DeleteCard"
import Section from "components/common/Section"
import GuildPicker from "components/create-hall/GuildPicker"
import Description from "components/create/Description"
import NameAndIcon from "components/create/NameAndIcon"

const EditForm = () => {
  const { account } = useWeb3React()
  const { colorMode } = useColorMode()

  if (!account) return <ConnectWalletAlert />

  return (
    <VStack spacing={10} alignItems="start">
      <Section title="Choose a logo and name for your Hall">
        <NameAndIcon />
      </Section>

      <Section title="Hall description">
        <Description />
      </Section>

      <GuildPicker shouldHaveMaxHeight />

      <Divider borderColor={colorMode === "light" ? "blackAlpha.400" : undefined} />

      <DeleteCard />
    </VStack>
  )
}

export default EditForm
