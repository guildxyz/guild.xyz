import { Box, DarkMode, HStack, Img, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import Card from "components/common/Card"
import LinkButton from "components/common/LinkButton"
import Section from "components/common/Section"
import ExplorerCardMotionWrapper from "components/explorer/ExplorerCardMotionWrapper"
import GuildCard from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import useMemberships, {
  Memberships,
} from "components/explorer/hooks/useMemberships"
import { Plus, Wallet } from "phosphor-react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { GuildBase } from "types"

type Props = {
  guildsInitial: GuildBase[]
}

const getUsersGuilds = (memberships: Memberships, guildsData: any) => {
  if (!memberships?.length || !guildsData?.length) return []
  const usersGuildsIds = memberships.map((membership) => membership.guildId)
  const newUsersGuilds = guildsData.filter((guild) =>
    usersGuildsIds.includes(guild.id)
  )
  return newUsersGuilds
}

const YourGuilds = ({ guildsInitial }: Props) => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  /**
   * Fetching all guilds without search params to filter user's guilds out of it.
   * `?order=members` is the default for the other filtered request too, so only one
   * request will be sent. There'll be a separate endpoint for it in the future
   */
  const { data: allGuilds, isLoading: isAllLoading } = useSWR(
    `/guild?order=members`,
    {
      fallbackData: guildsInitial,
      dedupingInterval: 60000, // one minute
    }
  )

  const { memberships } = useMemberships()
  const [usersGuilds, setUsersGuilds] = useState<GuildBase[]>(
    getUsersGuilds(memberships, allGuilds)
  )

  useEffect(() => {
    if (memberships && allGuilds)
      setUsersGuilds(getUsersGuilds(memberships, allGuilds))
  }, [memberships, allGuilds])

  return (
    <Section
      title="Your guilds"
      titleRightElement={
        usersGuilds?.length && (
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
      ) : usersGuilds?.length ? (
        <GuildCardsGrid>
          {usersGuilds.map((guild) => (
            <ExplorerCardMotionWrapper key={guild.urlName}>
              <GuildCard guildData={guild} />
            </ExplorerCardMotionWrapper>
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

export default YourGuilds
