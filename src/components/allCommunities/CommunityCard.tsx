import { useColorMode, Heading, Image, Stack, Tag, Wrap } from "@chakra-ui/react"
import Card from "components/common/Card"
import { Link } from "components/common/Link"
import { CommunityProvider } from "components/community/Context"
import type { Community } from "temporaryData/communities"

type Props = {
  community: Community
}

const CommunityCard = ({ community }: Props): JSX.Element => {
  const membersCount = community.levels
    .map((level) => level.membersCount)
    .reduce((accumulator, currentValue) => accumulator + currentValue)

  const { colorMode } = useColorMode()

  return (
    <CommunityProvider data={community}>
      <Link
        href={`/${community.urlName}`}
        _hover={{ textDecor: "none" }}
        borderRadius="2xl"
        w="full"
      >
        <Card
          role="group"
          px={{ base: 5, sm: 7 }}
          py="7"
          w="full"
          bgGradient={`linear(to-l, var(--chakra-colors-primary-100), ${
            colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
          })`}
          bgBlendMode={colorMode === "light" ? "normal" : "color"}
          bgRepeat="no-repeat"
          bgSize="400%"
          transition="background-size 0.8s ease"
          _hover={{
            bgSize: "100%",
            transition: "background-size 0.24s ease",
          }}
        >
          <Stack
            position="relative"
            direction="row"
            spacing={{ base: 5, sm: 10 }}
            alignItems="center"
          >
            <Image src={`${community.imageUrl}`} boxSize="45px" alt="Level logo" />
            <Stack spacing="3">
              <Heading size="sm">{community.name}</Heading>
              <Wrap spacing="2" shouldWrapChildren>
                <Tag colorScheme="alpha">{`${membersCount} members`}</Tag>
                <Tag colorScheme="alpha">{`${community.levels.length} levels`}</Tag>
                <Tag colorScheme="alpha">
                  {`min: ${community.levels[0].accessRequirement.amount} ${community.chainData.ropsten.token.symbol}`}
                </Tag>
              </Wrap>
            </Stack>
          </Stack>
        </Card>
      </Link>
    </CommunityProvider>
  )
}

export default CommunityCard
