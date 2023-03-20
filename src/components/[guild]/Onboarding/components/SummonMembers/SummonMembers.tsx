import { Text, useDisclosure, Wrap } from "@chakra-ui/react"
import Button from "components/common/Button"
import PulseMarker from "components/common/PulseMarker"
import useEditGuild from "components/[guild]/EditGuild/hooks/useEditGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import useDatadog from "components/_app/Datadog/useDatadog"
import { Check, DiscordLogo, TwitterLogo } from "phosphor-react"
import { PlatformType } from "types"
import PaginationButtons from "../PaginationButtons"
import SendDiscordJoinButtonAlert from "./components/SendDiscordJoinButtonAlert"
import SendDiscordJoinButtonModal from "./components/SendDiscordJoinButtonModal"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

export type SummonMembersForm = {
  channelId: string
  serverId: string
  title: string
  description: string
  button: string
}

const SummonMembers = ({ activeStep, prevStep, nextStep: _ }: Props) => {
  const { addDatadogAction } = useDatadog()

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
  const hasJoinButton = discordPlatform?.platformGuildData?.joinButton !== false

  const { onSubmit, isLoading, response } = useEditGuild()
  const handleFinish = () => {
    if (!hasJoinButton) {
      onAlertOpen()
      return
    }

    onSubmit({ onboardingComplete: true })
  }

  return (
    <>
      <Text mb="2">
        If you're satisfied with everything, it's time to invite your community to
        join!
      </Text>
      <Wrap overflow="visible">
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
            `Just summoned my guild on @guildxyz! Join me on my noble quest: guild.xyz/${urlName}`
          )}`}
          target="_blank"
          leftIcon={<TwitterLogo />}
          colorScheme="TWITTER"
          onClick={() => {
            addDatadogAction("click on Share [onboarding]")
          }}
        >
          Share
        </Button>
      </Wrap>
      <PaginationButtons
        activeStep={activeStep}
        prevStep={prevStep}
        nextStep={handleFinish}
        nextLabel="Finish"
        nextLoading={isLoading || response}
      />
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
