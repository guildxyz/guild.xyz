import { Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import useSetImageAndNameFromPlatformData from "components/create-guild/hooks/useSetImageAndNameFromPlatformData"
import usePinata from "hooks/usePinata"
import useServerData from "hooks/useServerData"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"

type Props = {
  onSubmit: () => void
}

const ServerSetupCard = ({ onSubmit }: Props): JSX.Element => {
  const { control, setValue } = useFormContext<GuildFormType>()

  const selectedServer = useWatch({
    control,
    name: "guildPlatforms.0.platformGuildId",
  })

  const {
    data: { serverIcon, serverName },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  const { onUpload } = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`)
    },
    onError: () => {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
    },
  })

  useSetImageAndNameFromPlatformData(serverIcon, serverName, onUpload)

  return (
    <Card px={{ base: 5, sm: 6 }} py={7}>
      <Stack spacing={8}>
        <DiscordRoleVideo />
        <Button colorScheme="green" onClick={onSubmit}>
          Got it
        </Button>
      </Stack>
    </Card>
  )
}

export default ServerSetupCard
