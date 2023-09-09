import { Box, HStack, Img, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import LinkButton from "components/common/LinkButton"
import GuildCard, { GuildSkeletonCard } from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Plus, Wallet } from "phosphor-react"
import { forwardRef } from "react"

const useYourGuilds = () =>
  useSWRWithOptionalAuth(`/v2/guilds`, {
    dedupingInterval: 60000, // one minute
    revalidateOnMount: true,
  })

const YourGuilds = forwardRef((_, ref: any) => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  const { data: usersGuilds, isLoading: isGuildsLoading } = useYourGuilds()

  return (
    <Box
      ref={ref}
      id="yourGuilds"
      mb={{ base: 8, md: 12, lg: 14 }}
      sx={{ ".chakra-heading": { color: "white" } }}
      scrollMarginTop={20}
    >
      {!account ? (
        <Card p="6">
          <Stack
            direction={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing="5"
          >
            <HStack spacing="4">
              <Img src="landing/robot.svg" boxSize={"2em"} />
              <Text fontWeight={"semibold"}>
                Connect your wallet to view your guilds / create new ones
              </Text>
            </HStack>
            <Button
              w={{ base: "full", sm: "auto" }}
              flexShrink="0"
              colorScheme="indigo"
              leftIcon={<Wallet />}
              onClick={openWalletSelectorModal}
            >
              Connect
            </Button>
          </Stack>
        </Card>
      ) : isGuildsLoading ? (
        <GuildCardsGrid>
          {[...Array(3)].map((_, i) => (
            <GuildSkeletonCard key={i} />
          ))}
        </GuildCardsGrid>
      ) : usersGuilds?.length ? (
        <GuildCardsGrid>
          {usersGuilds.map((guild) => (
            <GuildCard guildData={guild} key={guild.urlName} />
          ))}
        </GuildCardsGrid>
      ) : (
        <Card p="6">
          <Stack
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            spacing="6"
          >
            <HStack>
              <Text fontWeight={"semibold"}>
                You're not a member of any guilds yet. Explore and join some below,
                or create your own!
              </Text>
            </HStack>
            <LinkButton leftIcon={<Plus />} href="/create-guild" colorScheme="gray">
              Create guild
            </LinkButton>
          </Stack>
        </Card>
      )}
    </Box>
  )
})

export { useYourGuilds }
export default YourGuilds
