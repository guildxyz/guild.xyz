import { Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ErrorAlert from "components/common/ErrorAlert"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import usePinata from "hooks/usePinata"
import { useContext, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import DynamicDevTool from "./DynamicDevTool"
import Pagination from "./Pagination"
import TelegramGroup from "./TelegramGroup"

const CreateGuildTelegram = (): JSX.Element => {
  const methods = useFormContext<GuildFormType>()

  const guildPlatformId = useWatch({
    control: methods.control,
    name: "guildPlatforms.0.platformGuildId",
  })

  const { onUpload } = usePinata({
    // TODO: display an upload indicator somewhere
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
        "imageUrl",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
      )
    },
  })

  const { account } = useWeb3React()
  const { openWalletSelectorModal, triedEager } = useContext(Web3Connection)
  useEffect(() => {
    if (triedEager && !account) openWalletSelectorModal()
  }, [account, triedEager])

  return (
    <>
      {account ? (
        <>
          <Stack spacing={10}>
            {/* TODO: generalize the TelegramGroup component + rename it to TelegramGuildSetup? */}
            <TelegramGroup
              onUpload={onUpload}
              fieldName="guildPlatforms.0.platformGuildId"
            />

            <Pagination nextButtonDisabled={!guildPlatformId} />
          </Stack>
          <DynamicDevTool control={methods.control} />
        </>
      ) : (
        <ErrorAlert label="Please connect your wallet in order to continue!" />
      )}
    </>
  )
}

export default CreateGuildTelegram
