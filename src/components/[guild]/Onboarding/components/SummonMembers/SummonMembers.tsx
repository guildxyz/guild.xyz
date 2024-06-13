import { HStack, Text, useClipboard, useDisclosure, Wrap } from "@chakra-ui/react"
import { type DotLottieCommonPlayer, DotLottiePlayer } from "@dotlottie/react-player"
import useEditGuild from "components/[guild]/EditGuild/hooks/useEditGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import PulseMarker from "components/common/PulseMarker"
import { useRouter } from "next/router"
import { Check, Copy, DiscordLogo } from "phosphor-react"
import XLogo from "static/icons/x.svg"
import { useState } from "react"
import { PlatformType } from "types"
import SendDiscordJoinButtonAlert from "./components/SendDiscordJoinButtonAlert"
import SendDiscordJoinButtonModal from "./components/SendDiscordJoinButtonModal"

export type SummonMembersForm = {
  channelId: string
  serverId: string
  title: string
  description: string
  button: string
}

const SummonMembers = () => {
  const [, setPlayer] = useState<DotLottieCommonPlayer>()
  const { asPath } = useRouter()
  const { captureEvent } = usePostHogContext()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()
  const { guildPlatforms, urlName } = useGuild()

  const discordPlatform = guildPlatforms?.find(
    (p) => p.platformId === PlatformType.DISCORD
  )
  const hasJoinButton = !!discordPlatform?.platformGuildData?.joinButton

  const { onSubmit, isLoading, response } = useEditGuild()
  const handleFinish = () => {
    if (discordPlatform && !hasJoinButton) {
      onAlertOpen()
      return
    }

    onSubmit({ onboardingComplete: true })
  }
  const { onCopy, hasCopied } = useClipboard("guild.xyz" + asPath)

  return (
    <>
      <Text mb="2">
        If you're satisfied with everything, it's time to invite your community to
        join!
      </Text>
      <Wrap overflow="visible">
        <Button
          h="10"
          onClick={() => {
            captureEvent("guild creation flow > copy guild link")
            onCopy()
          }}
          leftIcon={hasCopied ? <Check /> : <Copy />}
        >
          {hasCopied ? "Copied" : "Copy link"}
        </Button>
        {discordPlatform &&
          (hasJoinButton ? (
            <Button h="10" isDisabled colorScheme="DISCORD" leftIcon={<Check />}>
              Join button sent to Discord
            </Button>
          ) : (
            <PulseMarker colorScheme="red" placement="top">
              <Button
                h="10"
                onClick={() => {
                  captureEvent("guild creation flow > Discord embed sent")
                  onOpen()
                }}
                colorScheme="DISCORD"
                leftIcon={<DiscordLogo />}
              >
                Send Discord join button
              </Button>
            </PulseMarker>
          ))}
        <Button
          as="a"
          h="10"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Just summoned my guild on Guild.xyz! Join me on my noble quest: guild.xyz/${urlName}`
          )}`}
          target="_blank"
          leftIcon={<XLogo />}
          colorScheme="TWITTER"
          onClick={() => {
            captureEvent("guild creation flow > click on 'Share' (Twitter - X)")
          }}
        >
          Share
        </Button>
      </Wrap>
      <HStack justifyContent={"space-between"} mt={8}>
        <HStack>
          <DotLottiePlayer
            autoplay
            speed={0.5}
            src="/logo.lottie"
            style={{
              height: 17,
              width: 17,
              opacity: 0.5,
            }}
            ref={(instance) => {
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
              setPlayer(instance)
            }}
          />
          <Text colorScheme="gray" fontSize={"sm"} fontWeight="medium">
            Guild 100% complete
          </Text>
        </HStack>
        <Button
          size="sm"
          onClick={() => {
            captureEvent("guild creation flow > onboarding close clicked")
            handleFinish()
          }}
          isLoading={isLoading || !!response}
          colorScheme="green"
        >
          Close
        </Button>
      </HStack>

      {discordPlatform && (
        <>
          <SendDiscordJoinButtonModal
            isOpen={isOpen}
            onClose={onClose}
            serverId={discordPlatform.platformGuildId}
          />

          <SendDiscordJoinButtonAlert
            isOpen={isAlertOpen}
            onClose={onAlertClose}
            onSendEmbed={() => {
              onOpen()
              onAlertClose()
            }}
            onContinue={() => {
              onSubmit({ onboardingComplete: true })
              onAlertClose()
            }}
          />
        </>
      )}
    </>
  )
}

export default SummonMembers
