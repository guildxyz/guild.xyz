import { Box, DarkMode, HStack, Img, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import Card from "components/common/Card"
import LinkButton from "components/common/LinkButton"
import Section from "components/common/Section"
import GuildCard, { GuildSkeletonCard } from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import useMemberships, {
  Memberships,
} from "components/explorer/hooks/useMemberships"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Plus, Wallet } from "phosphor-react"
import { useMemo } from "react"

const sortUsersGuilds = (memberships: Memberships, guildsData: any) => {
  if (!guildsData?.length) return []
  if (!memberships?.length) return guildsData

  const sortedUsersGuilds = guildsData
    .reduce((acc, currGuild) => {
      acc.push({
        ...currGuild,
        joinedAt: memberships.find(({ guildId }) => currGuild.id === guildId)
          ?.joinedAt,
      })
      return acc
    }, [])
    .sort((guildA, guildB) => (guildA.joinedAt > guildB.joinedAt ? 1 : -1))
  return sortedUsersGuilds
}

const useYourGuilds = () =>
  useSWRWithOptionalAuth(`/v2/guilds`, {
    dedupingInterval: 60000, // one minute
    revalidateOnMount: true,
  })

const YourGuilds = () => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  const { data: usersGuilds, isLoading: isGuildsLoading } = useYourGuilds()

  const { memberships, isLoading: isMembershipsLoading } = useMemberships()

  const orderedGuilds = useMemo(
    () => sortUsersGuilds(memberships, usersGuilds),
    [usersGuilds, memberships]
  )

  return (
    <Section
      title="Your guilds"
      titleRightElement={
        orderedGuilds?.length && (
          <Box my="-2 !important" ml="auto !important">
            <DarkMode>
              <LinkButton
                leftIcon={<Plus />}
                size="sm"
                variant="ghost"
                href="/create-guild"
              >
                Create guild
              </LinkButton>
            </DarkMode>
          </Box>
        )
      }
      mb={{ base: 8, md: 12, lg: 14 }}
      sx={{ ".chakra-heading": { color: "white" } }}
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
      ) : isGuildsLoading ||
        isMembershipsLoading ||
        (usersGuilds && memberships && !orderedGuilds) ? (
        <GuildCardsGrid>
          {[...Array(3)].map((_, i) => (
            <GuildSkeletonCard key={i} />
          ))}
        </GuildCardsGrid>
      ) : orderedGuilds?.length ? (
        <GuildCardsGrid>
          {orderedGuilds.map((guild) => (
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
    </Section>
  )
}

export { useYourGuilds }
export default YourGuilds
