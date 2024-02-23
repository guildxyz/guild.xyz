import { CircleWavyCheck } from "@phosphor-icons/react"
import { GUILD_PIN_MAINTENANCE } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPin/MintGuildPin"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useToastWithButton, useToastWithTweetButton } from "hooks/useToast"
import { atom, useSetAtom } from "jotai"
import { useRouter } from "next/router"
import useMembershipUpdate from "./useMembershipUpdate"

/**
 * Temporary to show "You might need to wait a few minutes to get your roles" on the
 * Discord reward card after join until we implement queues generally
 */
export const isAfterJoinAtom = atom(false)

const useJoin = (
  onSuccess?: Parameters<typeof useMembershipUpdate>[0],
  onError?: Parameters<typeof useMembershipUpdate>[1]
) => {
  const guild = useGuild()
  const user = useUser()
  const toastWithTweetButton = useToastWithTweetButton()
  const toastWithButton = useToastWithButton()
  const setIsAfterJoin = useSetAtom(isAfterJoinAtom)

  const mintGuildPinContext = useMintGuildPinContext()
  // Destructuring it separately, since we don't have a MintGuildPinContext on the POAP minting page
  const { onOpen } = mintGuildPinContext ?? {}
  const { pathname } = useRouter()

  const onJoinSuccess: Parameters<typeof useMembershipUpdate>[0] = (response) => {
    if (
      pathname === "/[guild]" &&
      guild.featureFlags.includes("GUILD_CREDENTIAL") &&
      guild.guildPin?.isActive &&
      !GUILD_PIN_MAINTENANCE
    ) {
      toastWithButton({
        status: "success",
        title: "Successfully joined guild",
        description: "Let others know as well by minting it onchain",
        buttonProps: {
          leftIcon: <CircleWavyCheck weight="fill" />,
          children: "Mint Guild Pin",
          onClick: onOpen,
        },
      })
    } else {
      toastWithTweetButton({
        title: "Successfully joined guild",
        tweetText: `Just joined the ${guild.name} guild. Continuing my brave quest to explore all corners of web3!
      guild.xyz/${guild.urlName}`,
      })
    }

    // mutate user in case they connected new platforms during the join flow
    user?.mutate?.()

    setIsAfterJoin(true)
    onSuccess?.(response)
  }

  const { triggerMembershipUpdate: onSubmit, ...rest } = useMembershipUpdate(
    onJoinSuccess,
    onError,
    true
  )

  return { ...rest, onSubmit }
}

export default useJoin
