import { AspectRatio, Img, Spinner, Square, Text, VStack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWRImmutable from "swr/immutable"
import { useMintCredentialContext } from "../MintCredentialContext"

const CredentialImage = (): JSX.Element => {
  const { id } = useGuild()
  const { credentialType } = useMintCredentialContext()

  const { data } = useSWRImmutable(
    `/assets/token/credentialImage?guildId=${id}&guildAction=${credentialType}`
  )

  return (
    <AspectRatio ratio={1}>
      {data ? (
        <Img
          w="full"
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${data}`}
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
