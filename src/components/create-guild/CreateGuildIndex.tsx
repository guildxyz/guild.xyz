import { Checkbox, HStack, Text } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import ClientOnly from "components/common/ClientOnly"
import { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"
import { useCreateGuildContext } from "./CreateGuildContext"
import MultiPlatformsGrid from "./MultiPlatformGrid"

const CreateGuildIndex = (): JSX.Element => {
  const { setDisabled } = useCreateGuildContext()
  const [whitoutPlatform, setWhitoutPlatform] = useState(false)
  const { captureEvent, startSessionRecording } = usePostHogContext()

  const guildPlatforms = useWatch({ name: "guildPlatforms" })
  const twitter = useWatch({ name: "socialLinks.TWITTER" })

  useEffect(() => {
    setDisabled(!twitter && guildPlatforms.length === 0 && !whitoutPlatform)
  }, [setDisabled, twitter, guildPlatforms.length, whitoutPlatform])

  return (
    <ClientOnly>
      <MultiPlatformsGrid
        onSelection={(platformName) => {
          if (platformName === "CONTRACT_CALL") startSessionRecording()
          if (platformName === "DISCORD")
            captureEvent("[discord setup] started through guild creation")

          setWhitoutPlatform(false)
        }}
      />

      <HStack w="full" justifyContent={"left"} pt={{ base: 4, md: 5 }} spacing={3}>
        <Text fontWeight="semibold" colorScheme="gray">
          or
        </Text>
        <Checkbox
          isChecked={whitoutPlatform}
          isDisabled={!!guildPlatforms.length || !!twitter}
          onChange={(e) => {
            if (guildPlatforms.length === 0) {
              setWhitoutPlatform(e?.target?.checked)
              if (e?.target?.checked)
                captureEvent("guild creation flow > add platforms later")
            }
          }}
          spacing={1.5}
        >
          <Text fontWeight="medium" colorScheme="gray">
            add rewards later
          </Text>
        </Checkbox>
      </HStack>
    </ClientOnly>
  )
}

export default CreateGuildIndex
