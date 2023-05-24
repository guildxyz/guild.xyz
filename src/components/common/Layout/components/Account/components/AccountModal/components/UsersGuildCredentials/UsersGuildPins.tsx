import { Flex, Text } from "@chakra-ui/react"
import Section from "components/common/Section"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import GuildPin from "./GuildPin"
import GuildPinSkeleton from "./GuildPinSkeleton"

const UsersGuildPins = () => {
  const { isAccountModalOpen } = useWeb3ConnectionManager()
  const { data, isValidating } = useUsersGuildPins(!isAccountModalOpen)

  return (
    <Section title="Guild Pins">
      <Flex direction="row">
        {isValidating ? (
          [...Array(3)].map((_, i) => <GuildPinSkeleton key={i} />)
        ) : data?.length ? (
          data.map((pin) => (
            <GuildPin
              key={pin.tokenId}
              image={pin.image}
              name={pin.name}
              guild={pin.attributes
                .find((attribute) => attribute.trait_type === "guildId")
                .value.toString()}
            />
          ))
        ) : (
          <Text colorScheme="gray">You haven't minted any Guild Pins yet.</Text>
        )}
      </Flex>
    </Section>
  )
}

export default UsersGuildPins
