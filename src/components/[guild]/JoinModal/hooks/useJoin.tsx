import { GUILD_PIN_MAINTENANCE } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPin/MintGuildPin"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { useToastWithButton, useToastWithTweetButton } from "hooks/useToast"
import { useRouter } from "next/router"
import { CircleWavyCheck } from "phosphor-react"
import useMembershipUpdate from "./useMembershipUpdate"

const useJoin = (
  onSuccess?: Parameters<typeof useMembershipUpdate>[0],
  onError?: Parameters<typeof useMembershipUpdate>[1]
) => {
  const guild = useGuild()
  const toastWithTweetButton = useToastWithTweetButton()
  const toastWithButton = useToastWithButton()

  const mintGuildPinContext = useMintGuildPinContext()
  // Destructuring it separately, since we don't have a MintGuildPinContext on the POAP minting page
  const { onOpen } = mintGuildPinContext ?? {}
  const { pathname } = useRouter()

  const onJoinSuccess: Parameters<typeof useMembershipUpdate>[0] = (response) => {
    if (!response?.success) return

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

    onSuccess?.(response)
  }

  const { triggerMembershipUpdate: onSubmit, ...rest } = useMembershipUpdate(
    onJoinSuccess,
    onError
  )

  return { ...rest, onSubmit }
}

export default useJoin
