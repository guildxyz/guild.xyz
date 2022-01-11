import { Flex, VStack } from "@chakra-ui/react"
import { DevTool } from "@hookform/devtools"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import LogicPicker from "components/create-guild/LogicPicker"
import NameAndIcon from "components/create-guild/NameAndIcon"
import Requirements from "components/create-guild/Requirements"
import SubmitButton from "components/create-guild/SubmitButton"
import useGuild from "components/[guild]/hooks/useGuild"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AddRolePage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const [formErrors, setFormErrors] = useState(null)

  const { id, platforms } = useGuild() || {}

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  // Setting up the platform (we'll manage 1 platform per guild for now)
  useEffect(() => {
    if (!id || !platforms?.[0]) return

    methods.setValue("guildId", id)
    methods.setValue("platform", platforms[0].platformType)
    methods.setValue("platformId", platforms[0].platformIdentifier)
    methods.setValue("channelId", platforms[0].inviteChannel)
  }, [methods, id, platforms])

  return (
    <>
      <Layout title="Add a role">
        {account ? (
          <FormProvider {...methods}>
            <ErrorAnimation errors={formErrors}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your role">
                  <NameAndIcon />
                </Section>

                <Section title="Role description">
                  <Description />
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
                Add role
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

export default AddRolePage
