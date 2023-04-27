import { AspectRatio, Img, Spinner, Square, Text, VStack } from "@chakra-ui/react"
import { useMintCredentialContext } from "../MintCredentialContext"

const CredentialImage = (): JSX.Element => {
  const { credentialImage } = useMintCredentialContext()

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
