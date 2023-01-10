import { Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import usePinata from "hooks/usePinata"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import DynamicDevTool from "./DynamicDevTool"
import Pagination from "./Pagination"
import TelegramGroup from "./TelegramGroup"
import useIsTGBotIn from "./TelegramGroup/hooks/useIsTGBotIn"

const CreateGuildTelegram = (): JSX.Element => {
  const router = useRouter()
  const { account } = useWeb3React()

  useEffect(() => {
    if (!account) {
      router.push("/create-guild")
    }
  }, [account])

  const methods = useFormContext<GuildFormType>()

  const guildPlatformId = useWatch({
    control: methods.control,
    name: "guildPlatforms.0.platformGuildId",
  })

  const { onUpload } = usePinata({
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
        "imageUrl",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
      )
    },
  })

  const {
    data: { ok },
  } = useIsTGBotIn(guildPlatformId, { refreshInterval: 5000 })

  return (
    <>
      <Stack spacing={10}>
        <TelegramGroup
          onUpload={onUpload}
          fieldName="guildPlatforms.0.platformGuildId"
        />

        <Pagination nextButtonDisabled={!guildPlatformId || !ok} />
      </Stack>
      <DynamicDevTool control={methods.control} />
    </>
  )
}

export default CreateGuildTelegram
