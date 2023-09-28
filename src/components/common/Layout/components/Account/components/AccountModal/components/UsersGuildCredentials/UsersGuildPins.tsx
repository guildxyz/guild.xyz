import { Box, Flex, Text } from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import { AccountSectionTitle } from "../AccountConnections"
import GuildPin from "./GuildPin"
import GuildPinSkeleton from "./GuildPinSkeleton"

const UsersGuildPins = () => {
  const { isAccountModalOpen } = useWeb3ConnectionManager()
  const { data, isValidating } = useUsersGuildPins(!isAccountModalOpen)

  return (
    <>
      <AccountSectionTitle title="Guild Pins" />
      <Box
        minW="full"
        overflowX="scroll"
        position="relative"
        mx={-4}
        className="invisible-scrollbar"
        sx={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0px, black var(--chakra-space-4), black calc(100% - var(--chakra-space-4)), transparent)",
        }}
      >
        <Flex minW="full" direction="row" px={4}>
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
                rank={pin.attributes
                  .find((attribute) => attribute.trait_type === "rank")
                  .value.toString()}
              />
            ))
          ) : (
            <Text fontSize="sm">You haven't minted any Guild Pins yet</Text>
          )}
        </Flex>
      </Box>
    </>
  )
}

export default UsersGuildPins
