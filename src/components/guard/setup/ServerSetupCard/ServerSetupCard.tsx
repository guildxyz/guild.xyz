import { FormControl, Select, SimpleGrid, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import FormErrorMessage from "components/common/FormErrorMessage"
import Section from "components/common/Section"
import useCreate from "components/create-guild/hooks/useCreate"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import useSetImageAndNameFromPlatformData from "components/create-guild/PickRolePlatform/hooks/useSetImageAndNameFromPlatformData"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useUploadPromise from "hooks/useUploadPromise"
import { useContext, useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useSWR from "swr"
import Disclaimer from "./components/Disclaimer"
import PickSecurityLevel from "./components/PickSecurityLevel/PickSecurityLevel"

const ServerSetupCard = (): JSX.Element => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)

  const {
    control,
    register,
    setValue,
    formState: { errors },
    handleSubmit: formHandleSubmit,
  } = useFormContext()

  const { data: servers } = useSWR("usersServers", null, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  })

  const selectedServer = useWatch({
    control,
    name: "DISCORD.platformId",
  })

  useEffect(() => {
    if (!selectedServer) setValue("name", "")
    setValue(
      "name",
      servers?.find((server) => server.value == selectedServer)?.label
    )
  }, [selectedServer])

  const {
    data: { channels, serverIcon, serverName },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  const [uploadPromise, setUploadPromise] = useState(null)
  useSetImageAndNameFromPlatformData(serverIcon, serverName, setUploadPromise)

  const { handleSubmit, isUploading, shouldBeLoading } = useUploadPromise(
    formHandleSubmit,
    uploadPromise
  )

  const { onSubmit, isLoading, response, isSigning } = useCreate()

  const loadingText = useMemo((): string => {
    if (isUploading) return "Uploading Guild image"
    if (isSigning) return "Check your wallet"
    return "Saving data"
  }, [isSigning, isUploading])

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          <Section title="Entry channel">
            <FormControl
              isInvalid={!!errors?.channelId}
              isDisabled={!channels?.length}
              defaultValue={channels?.[0]?.id}
            >
              <Select
                maxW="50%"
                size={"lg"}
                {...register("channelId", {
                  required: "This field is required.",
                })}
              >
                <option value={0} defaultChecked>
                  Create a new channel for me
                </option>
                {channels?.map((channel, i) => (
                  <option
                    key={channel.id}
                    value={channel.id}
                    defaultChecked={i === 0}
                  >
                    {channel.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors?.channelId?.message}</FormErrorMessage>
            </FormControl>
          </Section>

          <Section title="Security level">
            <PickSecurityLevel />
          </Section>

          <Disclaimer />

          <SimpleGrid columns={2} gap={4}>
            <Button
              colorScheme="gray"
              disabled={!!account}
              onClick={openWalletSelectorModal}
            >
              Connect wallet
            </Button>
            <Button
              colorScheme="green"
              disabled={!account}
              isLoading={isLoading || isSigning || shouldBeLoading}
              loadingText={loadingText}
              onClick={handleSubmit(onSubmit, console.log)}
            >
              {response ? "Success" : "Let's go!"}
            </Button>
          </SimpleGrid>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default ServerSetupCard
