import { TwitterLogo } from "phosphor-react"
import useActionToast from "./useActionToast"

type TweetToastOptions = {
  title: string
  tweetText: string
}

const useTweetToast = (): ((options: TweetToastOptions) => void) => {
  const toast = useActionToast()

  const tweetToast = ({ title, tweetText }: TweetToastOptions) =>
    toast({
      title,
      description: "Let others know as well by sharing it on Twitter",
      actionHref: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}`,
      actionText: "Tweet",
      actionIcon: <TwitterLogo weight="fill" />,
    })

  return tweetToast
}

export default useTweetToast
