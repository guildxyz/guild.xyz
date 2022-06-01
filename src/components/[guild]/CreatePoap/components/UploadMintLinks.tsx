import { Text, Textarea, VStack } from "@chakra-ui/react"
import Button from "components/common/Button"

type Props = {
  nextStep: () => void
}

const UploadMintLinks = ({ nextStep }: Props): JSX.Element => {
  // TODO: `useUploadMintLinks` hook
  const onSubmit = () => nextStep()

  return (
    <VStack spacing={6} alignItems={{ base: "start", md: "center" }}>
      <Text textAlign={{ base: "left", md: "center" }}>
        Please paste your mint links in the textarea below. Once you set up the bot,
        we'll send these links to the users who'd like to claim your POAP
      </Text>

      <Textarea minH={64} placeholder="Paste mint links here"></Textarea>

      <Button colorScheme="indigo" onClick={onSubmit}>
        Set up the bot
      </Button>
    </VStack>
  )
}

export default UploadMintLinks
