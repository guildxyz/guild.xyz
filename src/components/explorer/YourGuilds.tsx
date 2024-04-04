import { Box, HStack, Img, Stack, Text } from "@chakra-ui/react"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import Card from "components/common/Card"
import GuildCard, { GuildSkeletonCard } from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useSetAtom } from "jotai"
import Link from "next/link"
import { Plus, SignIn } from "phosphor-react"
import { forwardRef } from "react"
import { GuildBase } from "types"

const useYourGuilds = () =>
  useSWRWithOptionalAuth<GuildBase[]>(
    `/v2/guilds?yours=true`,
    undefined,
    false,
    true
  )

const YourGuilds = forwardRef((_, ref: any) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  const { data: usersGuilds, isLoading: isGuildsLoading } = useYourGuilds()

  return (
    <Box
      ref={ref}
      id="yourGuilds"
      mb={{ base: 8, md: 12, lg: 14 }}
      sx={{ ".chakra-heading": { color: "white" } }}
      scrollMarginTop={20}
    >
      {!isWeb3Connected ? (
        <Card p="6">
          <Stack
            direction={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing="5"
          >
            <HStack spacing="4">
              <Img src="landing/robot.svg" boxSize={"2em"} alt="Guild Robot" />
              <Text fontWeight={"semibold"}>
                Sign in to view your guilds / create new ones
              </Text>
            </HStack>
            <Button
              w={{ base: "full", sm: "auto" }}
              flexShrink="0"
              colorScheme="indigo"
              leftIcon={<SignIn />}
              onClick={() => setIsWalletSelectorModalOpen(true)}
            >
              Sign in
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
            <Button
              as={Link}
              leftIcon={<Plus />}
              href="/create-guild"
              prefetch={false}
            >
              Create guild
            </Button>
          </Stack>
        </Card>
      )}
    </Box>
  )
})

export { useYourGuilds }
export default YourGuilds
