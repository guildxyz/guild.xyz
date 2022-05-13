import { SimpleGrid, Stack } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import useSetImageAndNameFromPlatformData from "components/create-guild/hooks/useSetImageAndNameFromPlatformData"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useServerData from "hooks/useServerData"
import useUploadPromise from "hooks/useUploadPromise"
import { Check } from "phosphor-react"
import { useContext, useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const ServerSetupCard = ({ children }): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)

  const { control, handleSubmit: formHandleSubmit } = useFormContext()

  const selectedServer = useWatch({
    control,
    name: "DISCORD.platformId",
  })

  const {
    data: { serverIcon, serverName },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  const [uploadPromise, setUploadPromise] = useState(null)
  useSetImageAndNameFromPlatformData(serverIcon, serverName, setUploadPromise)

  const { handleSubmit, isUploading, shouldBeLoading } = useUploadPromise(
    formHandleSubmit,
    uploadPromise
  )

  const { onSubmit, isLoading, response, isSigning, error } = useCreateGuild()

  const loadingText = useMemo((): string => {
    if (isUploading) return "Uploading Guild image"
    if (isSigning) return "Check your wallet"
    return "Saving data"
  }, [isSigning, isUploading])

  useEffect(() => {
    if (error) {
      addDatadogError("Guild creation error", { error }, "custom")
    }

    if (response) {
      addDatadogAction("Successful guild creation")
    }
  }, [response, error])

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          {children}

          <SimpleGrid columns={2} gap={4}>
            <Button
              colorScheme="gray"
              disabled={!!account}
              onClick={openWalletSelectorModal}
              rightIcon={!!account && <Check />}
              data-dd-action-name="Connect wallet [dc server setup]"
            >
              {!account ? "Connect wallet" : "Wallet connected"}
            </Button>

            <Button
              colorScheme="green"
              disabled={
                !account || response || isLoading || isSigning || shouldBeLoading
              }
              isLoading={isLoading || isSigning || shouldBeLoading}
              loadingText={loadingText}
              onClick={handleSubmit(onSubmit, console.log)}
              data-dd-action-name="Sign to summon [dc server setup]"
            >
              Sign to summon
            </Button>
          </SimpleGrid>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default ServerSetupCard
