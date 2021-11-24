import { Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import GuildPicker from "components/create-hall/GuildPicker"
import Description from "components/create/Description"
import NameAndIcon from "components/create/NameAndIcon"
import SubmitButton from "components/create/SubmitButton"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import slugify from "utils/slugify"

const CreateHallPage = (): JSX.Element => {
  const methods = useForm({ mode: "all" })
  const [formErrors, setFormErrors] = useState(null)

  useEffect(() => {
    methods.register("urlName")
    methods.register("chainName", { value: "ETHEREUM" })
    methods.register("theme.color", { value: "#a3a3a3" })
    methods.register("theme.mode", { value: "DARK" })
  }, [])

  const hallName = useWatch({ control: methods.control, name: "name" })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    if (hallName) methods.setValue("urlName", slugify(hallName.toString()))
  }, [hallName])

  const { account } = useWeb3React()

  return (
    <FormProvider {...methods}>
      <Layout
        title="Create Hall"
        action={
          account && (
            <SubmitButton
              type="hall"
              onErrorHandler={(errors) =>
                setFormErrors(errors ? Object.keys(errors) : null)
              }
            />
          )
        }
      >
        {account ? (
          <>
            <ErrorAnimation errors={formErrors}>
              <Stack spacing={12}>
                <Section title="Choose a logo and name for your Hall">
                  <NameAndIcon />
                </Section>
                <Section title="Hall description">
                  <Description />
                </Section>
                <GuildPicker />
              </Stack>
            </ErrorAnimation>
          </>
        ) : (
          <ConnectWalletAlert />
        )}
      </Layout>
    </FormProvider>
  )
}

export default CreateHallPage
