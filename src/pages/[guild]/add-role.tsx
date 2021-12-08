import { Flex, VStack } from "@chakra-ui/react"
import { DevTool } from "@hookform/devtools"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import LogicPicker from "components/create-guild/LogicPicker"
import Requirements from "components/create-guild/Requirements"
import Description from "components/create/Description"
import NameAndIcon from "components/create/NameAndIcon"
import SubmitButton from "components/create/SubmitButton"
import useGuild from "components/[guild]/hooks/useGuild"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import slugify from "utils/slugify"

const AddRolePage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const [formErrors, setFormErrors] = useState(null)

  const { id, roles } = useGuild() || {}

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    methods.register("urlName")
    methods.register("chainName", { value: "ETHEREUM" })
  }, [])

  // Setting up the platform (we'll manage 1 platform per guild for now)
  useEffect(() => {
    if (!id || !roles?.[0]?.role?.rolePlatforms?.[0]?.platform) return
    methods.setValue("guildId", id)
    methods.setValue("platform", roles[0].role.rolePlatforms[0].platform.name)
    methods.setValue(
      "discordServerId",
      roles[0].role.rolePlatforms[0].platform.platformIdentifier
    )
  }, [methods, id, roles])

  const name = useWatch({ control: methods.control, name: "name" })

  useEffect(() => {
    if (name) methods.setValue("urlName", slugify(name.toString()))
  }, [name])

  return (
    <>
      <Layout title="Add a role">
        {account ? (
          <FormProvider {...methods}>
            <ErrorAnimation errors={formErrors}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your Role">
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
              />
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
