import {
  Box,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  useClipboard,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Section from "components/common/Section"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence, motion } from "framer-motion"
import { Check, CircleWavyCheck, CopySimple } from "phosphor-react"
import { useState } from "react"
import usePoapLinks from "../../hooks/usePoapLinks"
import useUpdateGuildPoap from "../../hooks/useUpdateGuildPoap"
import { useCreatePoapContext } from "../CreatePoapContext"
import usePoapEventDetails from "../Requirements/components/VoiceParticipation/hooks/usePoapEventDetails"
import ManageEvent from "./components/ManageEvent/ManageEvent"
import SendDiscordEmbed from "./components/SendDiscordEmbed"

const MotionBox = motion(Box)

const Distribution = (): JSX.Element => {
  const { urlName } = useGuild()
  const { poapData, onCloseHandler } = useCreatePoapContext()
  const { poapEventDetails } = usePoapEventDetails()

  const { hasCopied, onCopy } = useClipboard(
    `https://guild.xyz/${urlName}/claim-poap/${poapData?.fancy_id}`
  )

  const { poapLinks } = usePoapLinks(poapData.id)

  const { onSubmit: onActivateSubmit, isLoading: isActivateLoading } =
    useUpdateGuildPoap("ACTIVATE")

  const [success, setSuccess] = useState(false)

  if (poapLinks?.total === 0)
    return <Text>Please upload mint links before distributing your POAP.</Text>

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      <MotionBox
        key={success ? "success" : "setup-form"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
      >
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
                Discord server for it - now your friends can mint this magnificent
                POAP to their collection!
              </Text>
            </VStack>

            <Flex w="full" justifyContent="end">
              <Button colorScheme="indigo" onClick={onCloseHandler}>
                Done
              </Button>
            </Flex>
          </VStack>
        ) : (
          <Stack spacing={8} divider={<Divider />}>
            {poapEventDetails?.voiceChannelId && (
              <Section title="Manage event">
                <ManageEvent />
              </Section>
            )}
            <Section
              title={poapEventDetails?.voiceChannelId ? "Distribute POAP" : ""}
            >
              <Stack direction={{ base: "column", sm: "row" }}>
                <SendDiscordEmbed onSuccess={() => setSuccess(true)} />

                <Flex
                  h={{ base: 6, sm: 12 }}
                  w={{ base: "full", sm: 8 }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text as="span" fontWeight="bold" fontSize="sm" color="gray">
                    OR
                  </Text>
                </Flex>

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
                      onActivateSubmit({
                        id: poapEventDetails?.id,
                        activate: true,
                      })
                    }
                    leftIcon={<Icon as={CircleWavyCheck} />}
                    isLoading={isActivateLoading}
                    loadingText="Activating"
                  >
                    Activate POAP
                  </Button>
                )}
              </Stack>
            </Section>
          </Stack>
        )}
      </MotionBox>
    </AnimatePresence>
  )
}

export default Distribution
