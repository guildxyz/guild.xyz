import { Center, Img, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "next/link"
import { useRouter } from "next/router"
import { CaretDown } from "phosphor-react"
import Star from "static/icons/star.svg"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"

const LeaderboardScoreSelector = () => {
  const { urlName, guildPlatforms } = useGuild()
  const router = useRouter()

  if (!guildPlatforms) return null

  const scoreRewards = guildPlatforms.filter(
    (gp) => gp.platformId === PlatformType.SCORE
  )

  if (scoreRewards.length < 2) return null

  const scoreRewardsData = scoreRewards.map((score) => ({
    id: score.id.toString(),
    name: score.platformGuildData.name || "points",
    image: score.platformGuildData.imageUrl ? (
      <Img
        src={score.platformGuildData.imageUrl}
        boxSize={5}
        borderRadius={"full"}
      />
    ) : (
      <Center boxSize={5}>
        <Star />
      </Center>
    ),
  }))

  const currentScore = scoreRewardsData.find(
    (score) => score.id === router.query.scoreId
  )

  return (
    <Card borderRadius="xl" flexShrink={0}>
      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          size="sm"
          variant="ghost"
          rightIcon={<CaretDown />}
          leftIcon={currentScore.image}
        >
          {currentScore.name}
        </MenuButton>
        <MenuList>
          {scoreRewardsData.map((score) => (
            <Link
              key={score.id}
              passHref
              href={`/${urlName}/leaderboard/${score.id}`}
            >
              <MenuItem as="a" icon={score.image}>
                {score.name}
              </MenuItem>
            </Link>
          ))}
        </MenuList>
      </Menu>
    </Card>
  )
}

export default LeaderboardScoreSelector
