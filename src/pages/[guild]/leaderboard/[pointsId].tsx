import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Center,
  HStack,
  Link,
  Spinner,
  Stack,
  Wrap,
} from "@chakra-ui/react"
import { useTokenRewards } from "components/[guild]/AccessHub/hooks/useTokenRewards"
import GuildName from "components/[guild]/GuildName"
import SocialIcon from "components/[guild]/SocialIcon"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { LeaderboardAirdropCard } from "components/[guild]/leaderboard/LeaderboardAirdropCard"
import LeaderboardPointsSelector from "components/[guild]/leaderboard/LeaderboardPointsSelector"
import LeaderboardUserCard, {
  LeaderboardUserCardSkeleton,
} from "components/[guild]/leaderboard/LeaderboardUserCard"
import usePointsLeaderboard from "components/[guild]/leaderboard/hooks/usePointsLeaderboard"
import Card from "components/common/Card"
import ErrorAlert from "components/common/ErrorAlert"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import { BackButton } from "components/common/Layout/components/BackButton"
import Section from "components/common/Section"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import { useRouter } from "next/router"
import ErrorPage from "pages/_error"
import { useState } from "react"
import { PlatformType, SocialLinkKey } from "types"
import parseDescription from "utils/parseDescription"

const BATCH_SIZE = 25

const Leaderboard = () => {
  const router = useRouter()
  const { id: userId, addresses } = useUser()
  const { name, imageUrl, description, socialLinks, tags } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [renderedUsersCount, setRenderedUsersCount] = useState(BATCH_SIZE)

  const relatedTokenRewards = useTokenRewards(false, Number(router.query.pointsId))

  const { data, error } = usePointsLeaderboard()

  const wrapperRef = useScrollBatchedRendering({
    batchSize: BATCH_SIZE,
    disableRendering: data?.leaderboard?.length <= renderedUsersCount,
    setElementCount: setRenderedUsersCount,
  })

  const userData = data?.aroundUser?.find((user) => user.userId === userId)

  return (
    <Layout
      title={<GuildName {...{ name, tags }} />}
      textColor={textColor}
      ogTitle={`Leaderboard${name ? ` - ${name}` : ""}`}
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
    >
      <GuildTabs
        activeTab="LEADERBOARD"
        rightElement={<LeaderboardPointsSelector />}
      />
      <Stack spacing={10}>
        {(relatedTokenRewards.length || userData) && (
          <Stack spacing={3}>
            {relatedTokenRewards.map((guildPlatform) => (
              <LeaderboardAirdropCard
                key={guildPlatform.id}
                guildPlatform={guildPlatform}
              />
            ))}

            {userData && (
              <LeaderboardUserCard
                address={
                  userData.address ??
                  addresses?.find((address) => address.isPrimary).address
                }
                score={userData.totalPoints}
                position={userData.rank}
                isCurrentUser
                tooltipLabel="If your score is not up-to-date, it might take up to 3 minutes for it to update"
              />
            )}
          </Stack>
        )}

        <Section
          ref={wrapperRef}
          title={userData || relatedTokenRewards.length ? "Leaderboard" : undefined}
          spacing={3}
        >
          <>
            {error ? (
              <Card>
                <ErrorAlert
                  label={"Couldn't get leaderboard data"}
                  description={
                    "Please see the console for more details, and contact support if this is unexpected!"
                  }
                  pos="static" // so it doesn't overlay the LeaderboardPointsSelector
                  mb={0}
                />
              </Card>
            ) : data?.leaderboard?.length === 0 ? (
              <Card>
                <Alert status="info" pb="5" pos="static">
                  <AlertIcon />
                  <Stack>
                    <AlertTitle
                      position="relative"
                      top={"4px"}
                      fontWeight="semibold"
                    >
                      No members with this point type
                    </AlertTitle>
                    <AlertDescription>
                      The selected point type exists in the guild, but none of the
                      members have a score greated than 0
                    </AlertDescription>
                  </Stack>
                </Alert>
              </Card>
            ) : data?.leaderboard?.length ? (
              data.leaderboard
                .slice(0, renderedUsersCount)
                .map((userLeaderboardData, index) => (
                  <LeaderboardUserCard
                    key={index}
                    address={userLeaderboardData?.address}
                    score={userLeaderboardData?.totalPoints}
                    position={index + 1}
                    isCurrentUser={userLeaderboardData?.userId === userId}
                    tooltipLabel="If multiple members have the same score, rank is calculated based on join date"
                  />
                ))
            ) : (
              [...Array(25)].map((_, index) => (
                <LeaderboardUserCardSkeleton key={index} />
              ))
            )}
            {data?.leaderboard?.length > renderedUsersCount && (
              <Center pt={6}>
                <Spinner />
              </Center>
            )}
          </>
        </Section>
      </Stack>
    </Layout>
  )
}

const LeaderboardWrapper = (): JSX.Element => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { guildPlatforms, error, isDetailed } = useGuild()

  const hasPointsReward = guildPlatforms?.some(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  if (
    error ||
    (isWeb3Connected
      ? isDetailed && !hasPointsReward
      : Array.isArray(guildPlatforms) && !hasPointsReward)
  )
    return <ErrorPage statusCode={404} />

  return (
    <ThemeProvider>
      <Leaderboard />
    </ThemeProvider>
  )
}

export default LeaderboardWrapper
