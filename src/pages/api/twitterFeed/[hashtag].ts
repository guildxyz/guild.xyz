import { URLSearchParams } from "url"

export default async function handler(req, res) {
  const { hashtag } = req.query

  let data: any = []

  const urlSearchParams = new URLSearchParams({
    query: `#${hashtag}`,
    expansions: ["author_id", "referenced_tweets.id"],
    "tweet.fields": [
      "attachments",
      "author_id",
      "created_at",
      "context_annotations",
      "entities",
    ],
    "user.fields": ["username", "url", "profile_image_url"],
    "media.fields": ["url"],
  })

  if (!process.env.TWITTER_BEARER) {
    res.end(JSON.stringify([]))
  }

  try {
    const apiResponse = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?${urlSearchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
        },
      }
    )
    data = await apiResponse.json()
  } catch (error) {
    res.json([])
  }

  let mappedResponse = []
  if (data.data && data.includes) {
    mappedResponse = data.data.map((tweet) => {
      const tweetDate = new Date(tweet.created_at)

      return {
        ...tweet,
        tweetAsArray: tweet.entities?.hashtags
          ? convertTweetToArray(tweet.text, tweet.entities.hashtags)
          : null,
        created_at: tweetDate.toLocaleDateString(),
        user: data.includes.users.find((user) => user.id === tweet.author_id),
      }
    })
  }

  res.json(mappedResponse)
}

const convertTweetToArray = (
  originalTweet: string,
  hashTags: { start: number; end: number; tag: string }[]
) => {
  const tweetTextArray = []
  let textToSplit = originalTweet
  // TODO: optional chaining
  hashTags.forEach((hashTagInTweet) => {
    const splittedArray = textToSplit.split(`#${hashTagInTweet.tag}`)

    tweetTextArray.push(splittedArray[0])
    tweetTextArray.push(`#${hashTagInTweet.tag}`)
    ;[, textToSplit] = splittedArray
  })

  return tweetTextArray
}
