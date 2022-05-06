import { SimpleGrid, Stack } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import useSetImageAndNameFromPlatformData from "components/create-guild/hooks/useSetImageAndNameFromPlatformData"
import useEditGuild from "components/[guild]/EditGuildButton/hooks/useEditGuild"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useServerData from "hooks/useServerData"
import useUploadPromise from "hooks/useUploadPromise"
import { useRouter } from "next/router"
import { Check } from "phosphor-react"
import { useContext, useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useGuildByPlatformId from "../hooks/useGuildByPlatformId"

const ServerSetupCard = ({ children }): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const router = useRouter()

  const { control, setValue, handleSubmit: formHandleSubmit } = useFormContext()

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

  const { id, urlName, roles, platforms } = useGuildByPlatformId(selectedServer)

  useEffect(() => {
    if (!roles) return

    setValue("channelId", roles[0].platforms?.[0]?.inviteChannel)
    setValue("requirements", undefined)
    setValue("imageUrl", undefined, { shouldTouch: true })
    setValue("name", undefined, { shouldTouch: true })

    const hasFreeEntry = roles.some((role) =>
      role.requirements.some((req) => req.type === "FREE")
    )

    if (!hasFreeEntry) {
      setValue("roles", [
        {
          guildId: id,
          ...(platforms?.[0]
            ? {
                platform: platforms[0].type,
                platformId: platforms[0].platformId,
              }
            : {}),
          name: "Verified",
          description: "",
          logic: "AND",
          requirements: [{ type: "FREE" }],
          imageUrl: "/guildLogos/0.svg",
        },
      ])
    } else {
      setValue("roles", undefined)
    }
  }, [roles])

  const {
    onSubmit: onEditSubmit,
    isLoading: isEditLoading,
    response: editResponse,
    isSigning: isEditSigning,
  } = useEditGuild({ guildId: id, onSuccess: () => router.push(`/${urlName}`) })

  const loadingText = useMemo((): string => {
    if (isUploading) return "Uploading Guild image"
    if (isSigning || isEditSigning) return "Check your wallet"
    return "Saving data"
  }, [isSigning, isUploading, isEditSigning])

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
                !account ||
                response ||
                editResponse ||
                isLoading ||
                isSigning ||
                shouldBeLoading ||
                isEditLoading ||
                isEditSigning
              }
              isLoading={
                isLoading ||
                isSigning ||
                shouldBeLoading ||
                isEditLoading ||
                isEditSigning
              }
              loadingText={loadingText}
              onClick={handleSubmit(id ? onEditSubmit : onSubmit, console.log)}
              data-dd-action-name="Sign to submit [dc server setup]"
            >
              Sign to submit
            </Button>
          </SimpleGrid>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default ServerSetupCard
