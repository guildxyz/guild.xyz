import { Box, HStack, Img, ScaleFade, Spinner, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useEffect, useState } from "react"

type Props = {
  hashTag: string
}

const TwitterFeed = ({ hashTag }: Props): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [tweetsData, setTweetsData] = useState(null)

  useEffect(() => {
    fetch(`/api/twitterFeed/${hashTag}`)
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        setTweetsData(response)
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  if (loading)
    return (
      <HStack alignItems="center" justifyContent="center">
        <Spinner mx="auto" />
      </HStack>
    )

  if (!tweetsData?.length)
    return (
      <Card p={6} borderWidth={2} borderColor="TWITTER.500">
        <Text as="span" color="gray.400">
          {`It seems like there aren't any tweets with the #${hashTag} hashtag yet`}
        </Text>
      </Card>
    )

  return (
    <ScaleFade in={tweetsData?.length}>
      <Card p={2} borderWidth={2} borderColor="TWITTER.500">
        <Box
          maxHeight="sm"
          overflowX="hidden"
          overflowY="auto"
          className="custom-scrollbar"
        >
          <VStack px={4} width="full" spacing={0}>
            {tweetsData.map((tweet) => (
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
                <Img
                  src={tweet.user.profile_image_url}
                  boxSize={12}
                  rounded="full"
                />
                <VStack alignItems="start" spacing={1}>
                  <HStack spacing={2}>
                    <Text as="span" fontWeight="bold">
                      @{tweet.user.username}
                    </Text>
                    <Text as="span" color="gray.400">
                      ·
                    </Text>
                    <Text as="span" color="gray.400" fontSize="sm">
                      {tweet.created_at}
                    </Text>
                  </HStack>
                  <Text wordBreak="break-word" color="gray.300">
                    {tweet.text}
                  </Text>
                  {/* tweet.img && <Img src={tweet.img} rounded="lg" /> */}
                </VStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Card>
    </ScaleFade>
  )
}

export default TwitterFeed
