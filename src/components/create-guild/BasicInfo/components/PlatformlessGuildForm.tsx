import { Box, FormLabel, HStack } from "@chakra-ui/react"
import useDatadog from "components/_app/Datadog/useDatadog"
import usePinata from "hooks/usePinata"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import Description from "../../Description"
import IconSelector from "../../IconSelector"
import Name from "../../Name"

const PlatformlessGuildForm = (): JSX.Element => {
  const { addDatadogAction } = useDatadog()

  const { control, setValue } = useFormContext<GuildFormType>()
  const name = useWatch({ control, name: "name" })

  useEffect(() => {
    if (!name) return
    addDatadogAction("Typed in guild name (basic info)")
  }, [name])

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
    onError: () => {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`, {
        shouldTouch: true,
      })
    },
  })

  return (
    <>
      <Box>
        <FormLabel>Choose a logo and name for your guild</FormLabel>
        <HStack alignItems="start">
          <IconSelector uploader={iconUploader} />
          <Name />
        </HStack>
      </Box>
      <Description />
    </>
  )
}

export default PlatformlessGuildForm
