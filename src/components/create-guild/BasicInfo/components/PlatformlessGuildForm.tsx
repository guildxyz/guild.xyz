import { Box, FormLabel, HStack } from "@chakra-ui/react"
import usePinata from "hooks/usePinata"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import Description from "../../Description"
import IconSelector from "../../IconSelector"
import Name from "../../Name"

const PlatformlessGuildForm = (): JSX.Element => {
  const { setValue } = useFormContext<GuildFormType>()

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
