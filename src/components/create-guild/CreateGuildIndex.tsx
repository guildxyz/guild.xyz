import { Checkbox, HStack, Text } from "@chakra-ui/react"
import ClientOnly from "components/common/ClientOnly"
import { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"
import { useCreateGuildContext } from "./CreateGuildContext"
import CreateGuildPlatform from "./CreateGuildPlatform"
import MultiPlatformsGrid from "./MultiPlatformGrid"

const CreateGuildIndex = (): JSX.Element => {
  const { setPlatform, setDisabled } = useCreateGuildContext()
  const [whitoutPlatform, setWhitoutPlatform] = useState(false)

  const guildPlatforms = useWatch({ name: "guildPlatforms" })
  const twitter = useWatch({ name: "socialLinks.TWITTER" })

  useEffect(() => {
    setDisabled(!twitter && guildPlatforms.length === 0 && !whitoutPlatform)
  }, [twitter, guildPlatforms.length, whitoutPlatform])

  return (
    <ClientOnly>
      <MultiPlatformsGrid
        onSelection={(platformName) => {
          setPlatform(platformName)
          setWhitoutPlatform(false)
        }}
      />

      <HStack w="full" justifyContent={"left"} pt={{ base: 4, md: 6 }}>
        <Text fontWeight="medium" colorScheme="gray" opacity=".7">
          or
        </Text>
        <Checkbox
          isChecked={whitoutPlatform}
          isDisabled={!!guildPlatforms.length || !!twitter}
          onChange={(e) => {
            if (guildPlatforms.length === 0) {
              setPlatform(null)
              setWhitoutPlatform(e?.target?.checked)
            }
          }}
        >
          <Text fontWeight="medium" colorScheme="gray" opacity=".7">
            add platform later
          </Text>
        </Checkbox>
      </HStack>
      <CreateGuildPlatform />
    </ClientOnly>
  )
}

export default CreateGuildIndex
