import { PLATFORM_COLORS } from "@/components/Account/components/AccountModal/components/SocialAccount"
import { Anchor } from "@/components/ui/Anchor"
import { Icon } from "@phosphor-icons/react/dist/lib/types"
import { Heart, Share, UserPlus } from "@phosphor-icons/react/dist/ssr"
import { useMembershipUpdate } from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useIsIOS from "hooks/useIsIOS"
import usePopupWindow from "hooks/usePopupWindow"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { PropsWithChildren, useState } from "react"
import useSWR from "swr"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"

export type TwitterIntentAction = "follow" | "like" | "retweet"

type Props = {
  type?: "button" | "link"
  action: TwitterIntentAction
}

const label: Record<TwitterIntentAction, string> = {
  follow: "Follow",
  like: "Like post",
  retweet: "Repost",
}

const buttonIcon: Record<TwitterIntentAction, Icon> = {
  follow: UserPlus,
  like: Heart,
  retweet: Share,
}

const intentQueryParam: Record<TwitterIntentAction, string> = {
  like: "tweet_id",
  retweet: "tweet_id",
  follow: "screen_name",
}

const TWITTER_INTENT_BASE_URL = "https://x.com/intent"

const TwitterIntent = ({
  type = "button",
  action,
  children,
}: PropsWithChildren<Props>) => {
  const { id: userId, platformUsers } = useUser()
  const isTwitterConnected = platformUsers?.find(
    (pu) => pu.platformId === PlatformType.TWITTER_V1
  )
  const {
    type: requirementType,
    id: requirementId,
    data: { id },
    roleId,
  } = useRequirementContext()
  const { onOpen } = usePopupWindow()

  const { triggerMembershipUpdate } = useMembershipUpdate()
  const { reqAccesses } = useRoleMembership(roleId)
  const hasAccess = reqAccesses?.find(
    (req) => req.requirementId === requirementId
  )?.access

  // The intent links won't work properly on iOS deviced, so we just fall back to regular links in that case
  const isIOS = useIsIOS()

  const url =
    !!action && !!id
      ? isTwitterConnected && !hasAccess && !isIOS
        ? `${TWITTER_INTENT_BASE_URL}/${action}?${intentQueryParam[action]}=${id}`
        : requirementType === "TWITTER_FOLLOW_V2"
          ? `https://x.com/${id}`
          : `https://x.com/twitter/status/${id}`
      : undefined

  const completeAction = (signedValidation: SignedValidation) =>
    fetcher(`/v2/util/gate-callbacks?requirementType=${requirementType}`, {
      method: "POST",
      ...signedValidation,
    })

  const { onSubmit } = useSubmitWithSign(completeAction, {
    onSuccess: () => {
      triggerMembershipUpdate({ roleIds: [roleId] })
      setHasClicked(false)
    },
  })

  const [hasClicked, setHasClicked] = useState(false)
  // Calling the callback endpoint only on refocus
  useSWR(
    hasClicked ? ["twitterRequirement", requirementId, userId] : null,
    () => {
      if (hasAccess || !isTwitterConnected) return
      onSubmit({
        requirementId,
        id,
        userId,
      })
    },
    {
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnFocus: true,
      refreshInterval: 0,
    }
  )

  const onClick = () => {
    setHasClicked(true)
    if (type === "button") onOpen(url)
  }

  if (type === "link")
    return (
      <Anchor
        href={url ?? ""}
        target="_blank"
        onClick={onClick}
        showExternal
        variant="highlighted"
      >
        {children}
      </Anchor>
    )

  if (hasAccess) return null

  const IconComponent = buttonIcon[action]

  return (
    <RequirementButton
      variant="solid"
      leftIcon={<IconComponent weight="bold" />}
      onClick={onClick}
      className={PLATFORM_COLORS.TWITTER}
    >
      {label[action]}
    </RequirementButton>
  )
}

export default TwitterIntent
