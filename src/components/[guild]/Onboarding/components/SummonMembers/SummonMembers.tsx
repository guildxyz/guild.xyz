import { Text, useDisclosure, Wrap } from "@chakra-ui/react"
import Button from "components/common/Button"
import useEditGuild from "components/[guild]/EditGuild/hooks/useEditGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import useSyncMembersFromDiscord from "components/[guild]/RolePlatforms/components/PlatformCard/components/useDiscordCardProps/DiscordCardMenu/hooks/useSyncMembersFromDiscord"
import useDatadog from "components/_app/Datadog/useDatadog"
import {
  ArrowsCounterClockwise,
  Check,
  DiscordLogo,
  TwitterLogo,
} from "phosphor-react"
import platforms from "platforms"
import PaginationButtons from "../PaginationButtons"
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
  const { guildPlatforms, urlName } = useGuild()

  const discordPlatform = guildPlatforms?.find(
    (p) => p.platformId === platforms.DISCORD.id
  )
  const hasJoinButton = discordPlatform?.platformGuildData?.joinButton !== false

  const { onSubmit, isLoading, response } = useEditGuild()
  const handleFinish = () => {
    onSubmit({ onboardingComplete: true })
  }

  const {
    triggerSync,
    response: syncResponse,
    isLoading: isSyncLoading,
  } = useSyncMembersFromDiscord()

  return (
    <>
      <Text mb="2">
        If you're satisfied with everything, it's time to invite your community to
        join!
      </Text>
      <Wrap>
        {discordPlatform && (
          <>
            <Button
              leftIcon={syncResponse ? <Check /> : <ArrowsCounterClockwise />}
              onClick={triggerSync}
              isLoading={isSyncLoading}
              isDisabled={isSyncLoading || syncResponse}
              colorScheme="DISCORD"
              h="10"
            >
              Sync members from Discord
            </Button>
            {hasJoinButton ? (
              <Button h="10" isDisabled colorScheme="DISCORD" leftIcon={<Check />}>
                Join button sent to Discord
              </Button>
            ) : (
              <Button
                h="10"
                onClick={onOpen}
                colorScheme="DISCORD"
                leftIcon={<DiscordLogo />}
              >
                Send Discord join button
              </Button>
            )}
          </>
        )}
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
        <SendDiscordJoinButtonModal
          isOpen={isOpen}
          onClose={onClose}
          serverId={discordPlatform.platformGuildId}
        />
      )}
    </>
  )
}

export default SummonMembers
