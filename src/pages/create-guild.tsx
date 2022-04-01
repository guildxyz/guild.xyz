import { Flex, HStack, VStack } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import CreateGuildName from "components/create-guild/CreateGuildName"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import LogicPicker from "components/create-guild/LogicPicker"
import PickRolePlatform from "components/create-guild/PickRolePlatform"
import Requirements from "components/create-guild/Requirements"
import SubmitButton from "components/create-guild/SubmitButton"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useContext, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm<GuildFormType>({
    mode: "all",
    defaultValues: { logic: "AND" },
  })
  const [formErrors, setFormErrors] = useState(null)
  const [uploadPromise, setUploadPromise] = useState<Promise<void>>(null)
  const { openWalletSelectorModal, triedEager } = useContext(Web3Connection)

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    methods.register("urlName")
    methods.register("chainName", { value: "ETHEREUM" })
  }, [])

  useEffect(() => {
    if (triedEager && !account) openWalletSelectorModal()
  }, [account, triedEager])

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Create Guild">
        {account ? (
          <FormProvider {...methods}>
            <ErrorAnimation errors={formErrors}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your Guild">
                  <HStack spacing={2} alignItems="start">
                    <IconSelector setUploadPromise={setUploadPromise} />
                    <CreateGuildName />
                  </HStack>
                </Section>

                <Section title="Guild description">
                  <Description />
                </Section>

                <Section title="Choose a Realm">
                  <PickRolePlatform />
                </Section>

                <Section title="Requirements logic">
                  <LogicPicker />
                </Section>

                <Requirements />
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
          <ConnectWalletAlert />
        )}
      </Layout>
    </>
  )
}

export default WithRumComponentContext("Create guild page", CreateGuildPage)
