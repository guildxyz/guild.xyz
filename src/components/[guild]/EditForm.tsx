import { Alert, AlertDescription, AlertIcon, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Section from "components/common/Section"
import Requirements from "components/create-guild/Requirements"
import NameAndIcon from "components/create/NameAndIcon"

const EditForm = () => {
  const { account } = useWeb3React()

  if (!account)
    return (
      <Alert status="error" mb="6">
        <AlertIcon />
        <Stack>
          <AlertDescription position="relative" top={1}>
            Please connect your wallet in order to continue!
          </AlertDescription>
        </Stack>
      </Alert>
    )

  return (
    <VStack spacing={10} alignItems="start">
      <Section title="Choose a logo and name for your Guild">
        <NameAndIcon />
      </Section>

      <Requirements />
    </VStack>
  )
}

export default EditForm
