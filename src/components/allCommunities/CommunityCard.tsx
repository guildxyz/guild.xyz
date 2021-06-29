import { CommunityProvider } from "components/community/Context"
import { Link } from "components/common/Link"
import type { Community } from "temporaryData/communities"
import { Image, Heading, Stack, Tag } from "@chakra-ui/react"
import Card from "components/common/Card"

type Props = {
  community: Community
}

const CommunityCard = ({ community }: Props): JSX.Element => {
  const membersCount = community.levels
    .map((level) => level.membersCount)
    .reduce((accumulator, currentValue) => accumulator + currentValue)

  return (
    <CommunityProvider data={community}>
      <Link
        href={`/${community.urlName}`}
        _hover={{ textDecor: "none" }}
        borderRadius="2xl"
      >
        <Card
          role="group"
          p="7"
          bgGradient="linear(to-l, var(--chakra-colors-primary-50), white)"
          bgRepeat="no-repeat"
          bgSize="150%"
          bgPosition="-100%"
          transition="background-position 0.6s ease"
          _hover={{
            bgPosition: "0",
            transition: "background-position 0.4s ease",
          }}
        >
          <Stack
            position="relative"
            direction="row"
            spacing="10"
            alignItems="center"
          >
            <Image src={`${community.imageUrl}`} boxSize="45px" alt="Level logo" />
            <Stack spacing="3">
              <Heading size="sm">{community.name}</Heading>
              <Stack direction="row" spacing="3">
                <Tag
                  colorScheme="blackAlpha"
                  textColor="blackAlpha.700"
                >{`${membersCount} members`}</Tag>
                <Tag colorScheme="blackAlpha" textColor="blackAlpha.700">
                  {`${community.levels.length} levels`}
                </Tag>
                <Tag colorScheme="blackAlpha" textColor="blackAlpha.700">
                  {`min: ${community.levels[0].accessRequirement.amount} ${community.chainData.ropsten.token.symbol}`}
                </Tag>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Link>
    </CommunityProvider>
  )
}

export default CommunityCard
