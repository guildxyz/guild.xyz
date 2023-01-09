import { Box, FormLabel, HStack } from "@chakra-ui/react"
import usePinata from "hooks/usePinata"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import { defaultValues } from "./CreateGuildContext"
import Description from "./Description"
import IconSelector from "./IconSelector"
import Name from "./Name"
import Pagination from "./Pagination"

const CreateGuildWithoutPlatform = (): JSX.Element => {
  const { control, reset, setValue } = useFormContext<GuildFormType>()

  useEffect(() => {
    reset(defaultValues.DEFAULT)
  }, [])

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

  const guildName = useWatch({ control, name: "name" })

  return (
    <>
      <Box>
        <FormLabel>Choose a logo and name for your role</FormLabel>
        <HStack alignItems="start">
          <IconSelector uploader={iconUploader} />
          <Name />
        </HStack>
      </Box>
      <Description />

      <Pagination nextButtonDisabled={!guildName} />
    </>
  )
}

export default CreateGuildWithoutPlatform
