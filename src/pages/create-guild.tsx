import { Flex, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import LogicPicker from "components/create-guild/LogicPicker"
import PickGuildPlatform from "components/create-guild/PickGuildPlatform"
import Requirements from "components/create-guild/Requirements"
import NameAndIcon from "components/create/NameAndIcon"
import SubmitButton from "components/create/SubmitButton"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import slugify from "utils/slugify"

const CreateGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const [formErrors, setFormErrors] = useState(null)

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    methods.register("urlName")
    methods.register("chainName", { value: "ETHEREUM" })
    methods.register("isGuild", { value: true })
  }, [])

  const guildName = useWatch({ control: methods.control, name: "name" })

  useEffect(() => {
    if (guildName) methods.setValue("urlName", slugify(guildName.toString()))
  }, [guildName])

  return (
    <Layout pageTitle="Create Guild">
      {account ? (
        <FormProvider {...methods}>
          <ErrorAnimation errors={formErrors}>
            <VStack spacing={10} alignItems="start">
              <Section title="Choose a logo and name for your Guild">
                <NameAndIcon />
              </Section>

              <Section title="Choose a Realm">
                <PickGuildPlatform />
              </Section>

              <Section title="Requirements logic">
                <LogicPicker />
              </Section>

              <Requirements />
            </VStack>
          </ErrorAnimation>
          <Flex justifyContent="right" mt="14">
            <SubmitButton
              type="guild"
              onErrorHandler={(errors) =>
                setFormErrors(errors ? Object.keys(errors) : null)
              }
            />
          </Flex>
        </FormProvider>
      ) : (
        <ConnectWalletAlert />
      )}
    </Layout>
  )
}

export default CreateGuildPage
