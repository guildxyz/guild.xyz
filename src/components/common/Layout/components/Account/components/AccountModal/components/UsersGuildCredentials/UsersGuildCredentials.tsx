import { Flex, Text } from "@chakra-ui/react"
import Section from "components/common/Section"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import useUsersGuildCredentials from "hooks/useUsersGuildCredentials"
import Credential from "./Credential"
import CredentialSkeleton from "./CredentialSkeleton"

const UsersGuildCredentials = () => {
  const { isAccountModalOpen } = useWeb3ConnectionManager()
  const { data, isValidating } = useUsersGuildCredentials(!isAccountModalOpen)

  return (
    <Section title="Guild Credentials">
      <Flex direction="row">
        {isValidating ? (
          [...Array(3)].map((_, i) => <CredentialSkeleton key={i} />)
        ) : data?.length ? (
          data.map((credential) => (
            <Credential
              key={credential.tokenId}
              image={credential.image}
              name={credential.name}
              guildId={
                credential.attributes.find(
                  (attribute) => attribute.trait_type === "guildId"
                ).value
              }
            />
          ))
        ) : (
          <Text colorScheme="gray">You haven't minted Guild Credentials yet.</Text>
        )}
      </Flex>
    </Section>
  )
}

export default UsersGuildCredentials
