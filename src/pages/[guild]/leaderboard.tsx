import { HStack, Link, Stack, Wrap } from "@chakra-ui/react"
import SocialIcon from "components/[guild]/SocialIcon"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import LeaderboardUserCard, {
  LeaderboardUserCardSkeleton,
} from "components/[guild]/leaderboard/LeaderboardUserCard"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import BackButton from "components/common/Layout/components/BackButton"
import Section from "components/common/Section"
import VerifiedIcon from "components/common/VerifiedIcon"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import ErrorPage from "pages/_error"
import { PlatformType, SocialLinkKey } from "types"
import parseDescription from "utils/parseDescription"

const Leaderboard = () => {
  const { id: userId } = useUser()
  const { id: guildId, name, imageUrl, description, socialLinks, tags } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { isValidating, data } = useSWRWithOptionalAuth(
    guildId ? `/v2/guilds/${guildId}/scores/leaderboard` : null,
    null,
    false,
    false
  )

  const userData = data?.aroundUser?.find((user) => user.userId === userId)

  return (
    <Layout
      title={name}
      textColor={textColor}
      ogTitle={`Events${name ? ` - ${name}` : ""}`}
      ogDescription={description}
      description={
        <>
          {description && parseDescription(description)}
          {Object.keys(socialLinks ?? {}).length > 0 && (
            <Wrap w="full" spacing={3} mt="3">
              {Object.entries(socialLinks).map(([type, link]) => {
                const prettyLink = link
                  .replace(/(http(s)?:\/\/)*(www\.)*/i, "")
                  .replace(/\/+$/, "")

                return (
                  <HStack key={type} spacing={1.5}>
                    <SocialIcon type={type as SocialLinkKey} size="sm" />
                    <Link
                      href={link?.startsWith("http") ? link : `https://${link}`}
                      isExternal
                      fontSize="sm"
                      fontWeight="semibold"
                      color={textColor}
                    >
                      {prettyLink}
                    </Link>
                  </HStack>
                )
              })}
            </Wrap>
          )}
        </>
      }
      image={
        <GuildLogo
          imageUrl={imageUrl}
          size={{ base: "56px", lg: "72px" }}
          mt={{ base: 1, lg: 2 }}
          bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
        />
      }
      imageUrl={imageUrl}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
      backButton={<BackButton />}
      titlePostfix={
        tags?.includes("VERIFIED") && (
          <VerifiedIcon size={{ base: 5, lg: 6 }} mt={-1} />
        )
      }
    >
      <GuildTabs activeTab="LEADERBOARD" />
      <Stack spacing={10}>
        {userData && (
          <LeaderboardUserCard
            address={userData.address}
            score={userData.totalScore}
            position={userData.rank}
            isCurrentUser
          />
        )}

        <Section title={userData ? "Leaderboard" : undefined} spacing={3}>
          <>
            {data?.leaderboard?.filter(Boolean).map((userLeaderboardData, index) => (
              <LeaderboardUserCard
                key={index}
                address={userLeaderboardData?.address}
                score={userLeaderboardData?.totalScore}
                position={index + 1}
                isCurrentUser={userLeaderboardData?.userId === userId}
              />
            ))}
            {isValidating &&
              [...Array(25)].map((_, index) => (
                <LeaderboardUserCardSkeleton key={index} />
              ))}
          </>
        </Section>
      </Stack>
    </Layout>
  )
}

const LeaderboardWrapper = (): JSX.Element => {
  const { guildPlatforms, error } = useGuild()

  const hasScoreReward = guildPlatforms?.some(
    (gp) => gp.platformId === PlatformType.SCORE
  )

  if (error || (guildPlatforms && !hasScoreReward))
    return <ErrorPage statusCode={404} />

  return (
    <ThemeProvider>
      <Leaderboard />
    </ThemeProvider>
  )
}

export default LeaderboardWrapper
