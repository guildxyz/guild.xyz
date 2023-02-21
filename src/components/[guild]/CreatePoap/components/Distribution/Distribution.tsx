import { Box, Flex, Stack, Text, useClipboard, VStack } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import LogicDivider from "components/[guild]/LogicDivider"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { Check, CopySimple } from "phosphor-react"
import { useState } from "react"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import { GuildPoap, PlatformType, Poap } from "types"
import useUpdateGuildPoap from "../../hooks/useUpdateGuildPoap"
import SendDiscordEmbed from "./components/SendDiscordEmbed"

type Props = {
  guildPoap: GuildPoap
  poap: Poap
} & UseSubmitOptions

const Distribution = ({ guildPoap, poap, onSuccess }: Props): JSX.Element => {
  const { urlName, guildPlatforms } = useGuild()
  const { poapEventDetails } = usePoapEventDetails()

  const { hasCopied, onCopy } = useClipboard(
    `https://guild.xyz/${urlName}/claim-poap/${poap?.fancy_id}`
  )

  const { onSubmit: onActivateSubmit, isLoading: isActivateLoading } =
    useUpdateGuildPoap(guildPoap, { onSuccess })

  const [success, setSuccess] = useState(false)

  const showDiscord = guildPlatforms?.some(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  return (
    <Box>
      {success ? (
        <VStack spacing={6}>
          <VStack
            pb={32}
            spacing={6}
            alignItems={{ base: "start", md: "center" }}
            bg="url('/img/poap-illustration.svg') no-repeat bottom center"
          >
            <Text fontSize="3xl" fontFamily="display" fontWeight="bold">
              Hooray!
            </Text>
            <Text textAlign={{ base: "left", md: "center" }} maxW="md">
              You've successfully dropped a POAP and set up a mint button on your
              Discord server for it - now your friends can mint this magnificent POAP
              to their collection!
            </Text>
          </VStack>

          <Flex w="full" justifyContent="end">
            <Button colorScheme="green" onClick={onSuccess}>
              Done
            </Button>
          </Flex>
        </VStack>
      ) : (
        <Stack spacing="8">
          <Text>
            Your POAP is all set up, but is not visible yet publicly. Activate it to
            start distributing!
          </Text>
          <Stack spacing="0">
            {poapEventDetails?.activated ? (
              <Button
                onClick={onCopy}
                leftIcon={hasCopied ? <Check /> : <CopySimple />}
              >
                {`${hasCopied ? "Copied" : "Copy"} claim page link`}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  onActivateSubmit({ id: guildPoap.id, activate: true })
                }
                isLoading={isActivateLoading}
                colorScheme="green"
                loadingText="Activating"
              >
                Activate POAP
              </Button>
            )}
            {showDiscord && (
              <>
                <LogicDivider logic="OR" />
                <SendDiscordEmbed poap={poap} onSuccess={() => setSuccess(true)} />
              </>
            )}
          </Stack>
        </Stack>
      )}
    </Box>
  )
}

export default Distribution
