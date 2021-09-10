import { HStack, Img, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"

type Props = {
  hashTag: string
}

const TEMP_TWEETS = [
  {
    id: 1,
    avatar: "https://avatars.githubusercontent.com/u/53289941?s=48&v=4",
    userName: "@hemlobemlo",
    text: "This tweet is about #asd123!",
  },
  {
    id: 2,
    avatar: "https://avatars.githubusercontent.com/u/53289941?s=48&v=4",
    userName: "@randomuser",
    text: "Pssst!!! #asd123 Agora Space admin page LEAKED SCREENSHOT OMG!",
    img: "https://agora.space/images/social-token-admin.png",
  },
  {
    id: 3,
    avatar: "https://avatars.githubusercontent.com/u/53289941?s=48&v=4",
    userName: "@swagyolonas",
    text: "Hehe. #asd123",
  },
]

const TwitterFeed = ({ hashTag }: Props): JSX.Element => {
  const a = "asd"

  return (
    <Card p={2} borderWidth={2} borderColor="TWITTER.500">
      <VStack px={4} width="full" spacing={0}>
        {TEMP_TWEETS.map((tweet) => (
          <HStack
            key={tweet.id}
            py={4}
            width="full"
            borderBottomWidth={1}
            borderBottomColor="gray.600"
            spacing={4}
            alignItems="start"
            _last={{
              borderBottomWidth: 0,
            }}
          >
            <Img src={tweet.avatar} boxSize={12} rounded="full" />
            <VStack alignItems="start" spacing={1}>
              <HStack spacing={2}>
                <Text as="span" fontWeight="bold">
                  {tweet.userName}
                </Text>
                <Text as="span" color="gray.400">
                  ·
                </Text>
                <Text as="span" color="gray.400" fontSize="sm">
                  1 min
                </Text>
              </HStack>
              <Text color="gray.300">{tweet.text}</Text>
              {tweet.img && <Img src={tweet.img} rounded="lg" />}
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Card>
  )
}

export default TwitterFeed
