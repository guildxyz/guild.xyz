import { Flex, VStack } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import ErrorAlert from "components/common/ErrorAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import SetRequirements from "components/create-guild/Requirements"
import SubmitButton from "components/create-guild/SubmitButton"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useContext, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"

const CreateTelegramGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm<GuildFormType>({
    mode: "all",
    defaultValues: {
      name: "My guild",
      imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
      chainName: "ETHEREUM",
      logic: "AND",
      channelId: "0",
      platform: "TELEGRAM",
    },
  })
  const [formErrors, setFormErrors] = useState(null)
  const [uploadPromise, setUploadPromise] = useState<Promise<void>>(null)
  const { openWalletSelectorModal, triedEager } = useContext(Web3Connection)

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    if (triedEager && !account) openWalletSelectorModal()
  }, [account, triedEager])

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Create Guild on Telegram">
        {account ? (
          <FormProvider {...methods}>
            <ErrorAnimation errors={formErrors}>
              <VStack spacing={10} alignItems="start">
                <TelegramGroup setUploadPromise={setUploadPromise} />

                <SetRequirements />
              </VStack>
            </ErrorAnimation>
            <Flex justifyContent="right" mt="14">
              <SubmitButton
                uploadPromise={uploadPromise}
                onErrorHandler={(errors) => {
                  console.log(errors)
                  return setFormErrors(errors ? Object.keys(errors) : null)
                }}
              >
                Summon
              </SubmitButton>
            </Flex>
            <DynamicDevTool control={methods.control} />
          </FormProvider>
        ) : (
          <ErrorAlert label="Please connect your wallet in order to continue!" />
        )}
      </Layout>
    </>
  )
}

export default WithRumComponentContext(
  "Create Telegram guild page",
  CreateTelegramGuildPage
)
