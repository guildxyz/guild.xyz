import { Icon, Link } from "@chakra-ui/react"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import usePopupWindow from "hooks/usePopupWindow"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, type SignedValdation } from "hooks/useSubmit"
import { Heart, Share, UserPlus, type IconProps } from "phosphor-react"
import { PropsWithChildren, useState } from "react"
import useSWR from "swr"
import fetcher from "utils/fetcher"

export type TwitterIntentAction = "follow" | "like" | "retweet"

type Props = {
  type?: "button" | "link"
  action: TwitterIntentAction
}

const label: Record<TwitterIntentAction, string> = {
  follow: "Follow",
  like: "Like tweet",
  retweet: "Retweet",
}

const buttonIcon: Record<
  TwitterIntentAction,
  React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
> = {
  follow: UserPlus,
  like: Heart,
  retweet: Share,
}

const intentQueryParam: Record<TwitterIntentAction, string> = {
  like: "tweet_id",
  retweet: "tweet_id",
  follow: "screen_name",
}

const TWITTER_INTENT_BASE_URL = "https://twitter.com/intent"

const completeAction = (signedValidation: SignedValdation) =>
  fetcher("/v2/util/gate-callbacks?requirementType=LINK_VISIT", {
    ...signedValidation,
    method: "POST",
  })

const TwitterIntent = ({
  type = "button",
  action,
  children,
}: PropsWithChildren<Props>) => {
  const { id: userId } = useUser()
  const {
    id: requirementId,
    data: { id },
  } = useRequirementContext()
  const { onOpen } = usePopupWindow()
  const url =
    !!action && !!id
      ? `${TWITTER_INTENT_BASE_URL}/${action}?${intentQueryParam[action]}=${id}`
      : undefined

  const { data: accesses, mutate: mutateAccess } = useAccess()
  const hasAccess = accesses
    ?.flatMap((role) => role.requirements)
    .find((req) => req.requirementId === requirementId)?.access

  const [hasClicked, setHasClicked] = useState(false)

  const showErrorToast = useShowErrorToast()
  const { onSubmit } = useSubmitWithSign(completeAction, {
    onSuccess: async () => {
      await mutateAccess()
      setHasClicked(false)
    },
    onError: () => showErrorToast("Something went wrong"),
  })

  // Completing the action on refocus (when the user closes the popup window)
  useSWR(
    ["completeTwitterAction", userId, requirementId],
    () => {
      if (!hasClicked) return
      onSubmit({
        requirementId,
        id,
        userId,
      })
    },
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  const onClick = () => {
    onOpen(url)
    setHasClicked(true)
  }

  if (type === "link")
    return (
      <Link
        href={url}
        onClick={onClick}
        isExternal
        colorScheme="blue"
        fontWeight="medium"
      >
        {children}
      </Link>
    )

  if (hasAccess) return null

  return (
    <Button
      colorScheme="twitter"
      leftIcon={<Icon as={buttonIcon[action]} />}
      iconSpacing={1}
      size="xs"
      isLoading={!url || hasClicked}
      onClick={onClick}
    >
      {label[action]}
    </Button>
  )
}

export default TwitterIntent
