import { Flex, VStack } from "@chakra-ui/react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { DevTool } from "@hookform/devtools"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import LogicPicker from "components/create-guild/LogicPicker"
import PickRolePlatform from "components/create-guild/PickRolePlatform"
import Requirements from "components/create-guild/Requirements"
import Description from "components/create/Description"
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
  }, [])

  const name = useWatch({ control: methods.control, name: "name" })

  useEffect(() => {
    if (name) methods.setValue("urlName", slugify(name.toString()))
  }, [name])

  return (
    <>
      <Layout title="Create Guild">
        {account ? (
          <FormProvider {...methods}>
            <ErrorAnimation errors={formErrors}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your Guild">
                  <NameAndIcon />
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
                onErrorHandler={(errors) => {
                  console.log(errors)
                  return setFormErrors(errors ? Object.keys(errors) : null)
                }}
              >
                Summon
              </SubmitButton>
            </Flex>
          </FormProvider>
        ) : (
          <ConnectWalletAlert />
        )}
      </Layout>
      {process.env.NODE_ENV === "development" && (
        <DevTool control={methods.control} />
      )}
    </>
  )
}

export default CreateGuildPage
