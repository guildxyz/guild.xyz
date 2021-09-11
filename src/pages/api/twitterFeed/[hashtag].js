export default async function handler(req, res) {
  const { hashtag } = req.query

  let data = []

  const urlSearchParams = new URLSearchParams({
    query: `#${hashtag}`,
    expansions: ["author_id"],
    "tweet.fields": ["attachments", "author_id", "created_at", "withheld"],
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
    // TODO...
    res.end(JSON.stringify([]))
  }

  let mappedResponse = []
  if (data.data && data.includes) {
    mappedResponse = data.data.map((tweet) => {
      const tweetDate = new Date(tweet.created_at)

      return {
        ...tweet,
        created_at: tweetDate.toLocaleDateString(),
        user: data.includes.users.find((user) => user.id === tweet.author_id),
      }
    })
  }

  res.end(JSON.stringify(mappedResponse))
}
