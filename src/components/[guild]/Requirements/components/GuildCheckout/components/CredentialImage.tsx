import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AspectRatio,
  Img,
  Spinner,
  Square,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMintCredentialContext } from "../MintCredentialContext"

const CredentialImage = (): JSX.Element => {
  const { credentialImage, error } = useMintCredentialContext()

  if (error)
    return (
      <Alert status="error" pb="6">
        <AlertIcon />
        <Stack top="1" position="relative" w="full">
          <AlertTitle>Couldn't generate credential</AlertTitle>
          <AlertDescription wordBreak={"break-word"}>{error}</AlertDescription>
        </Stack>
      </Alert>
    )

  return (
    <AspectRatio ratio={1}>
      {credentialImage ? (
        <Img
          w="full"
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${credentialImage}`}
          alt="Guild Credential image"
          borderRadius="xl"
        />
      ) : (
        <Square borderWidth={2} borderStyle="dashed" borderRadius="xl">
          <VStack>
            <Spinner size="xl" />
            <Text fontFamily="display" fontWeight="bold">
              Generating credential
            </Text>
          </VStack>
        </Square>
      )}
    </AspectRatio>
  )
}

export default CredentialImage
