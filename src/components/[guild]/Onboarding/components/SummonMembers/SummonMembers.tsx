import { HStack, Text, useClipboard, useDisclosure, Wrap } from "@chakra-ui/react"
import { Player } from "@lottiefiles/react-lottie-player"
import useEditGuild from "components/[guild]/EditGuild/hooks/useEditGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import PulseMarker from "components/common/PulseMarker"
import { useRouter } from "next/router"
import { Check, Copy, DiscordLogo, TwitterLogo } from "phosphor-react"
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
  const [player, setPlayer] = useState<any>()
  const { asPath } = useRouter()

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
        <Button h="10" onClick={onCopy} leftIcon={hasCopied ? <Check /> : <Copy />}>
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
                onClick={onOpen}
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
          leftIcon={<TwitterLogo />}
          colorScheme="TWITTER"
        >
          Share
        </Button>
      </Wrap>
      <HStack justifyContent={"space-between"} mt={8}>
        <HStack>
          <Player
            autoplay
            keepLastFrame
            speed={0.5}
            src="/logo_lottie.json"
            style={{
              height: 17,
              width: 17,
              opacity: 0.5,
            }}
            lottieRef={(instance) => {
              setPlayer(instance)
            }}
          />
          <Text colorScheme="gray" fontSize={"sm"} fontWeight="medium">
            Guild 100% complete
          </Text>
        </HStack>
        <Button
          size="sm"
          onClick={handleFinish}
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
