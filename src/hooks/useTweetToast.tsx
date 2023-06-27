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
      buttonProps: {
        leftIcon: <TwitterLogo weight="fill" />,
        children: "Tweet",
        as: "a",
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          tweetText
        )}`,
        target: "_blank",
      },
    })

  return tweetToast
}

export default useTweetToast
