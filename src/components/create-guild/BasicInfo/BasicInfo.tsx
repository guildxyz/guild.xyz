import { Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Section from "components/common/Section"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import CreateGuildButton from "../CreateGuildButton"
import { useCreateGuildContext } from "../CreateGuildContext"
import Pagination from "../Pagination"
import ContactInfo from "./components/ContactInfo"
import PlatformlessGuildForm from "./components/PlatformlessGuildForm"
import TwitterUrlInput from "./components/TwitterUrlInput"

const BasicInfo = (): JSX.Element => {
  const { addDatadogAction } = useDatadog()

  const { platform, template } = useCreateGuildContext()
  const {
    control,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const guildName = useWatch({ control, name: "name" })
  const contacts = useWatch({ control, name: "contacts" })

  useEffect(() => {
    if (!contacts?.length) return
    addDatadogAction("Added contact (basic info)")
  }, [contacts])

  return (
    <>
      <Card px={{ base: 5, sm: 6 }} py={8}>
        <Stack spacing={10}>
          {platform === "DEFAULT" && <PlatformlessGuildForm />}

          <Section title="How could we contact you?">
            <ContactInfo />
          </Section>

          {template === "GROWTH" && (
            <Section title="Links for community members">
              <TwitterUrlInput />
            </Section>
          )}
        </Stack>
      </Card>

      <Pagination nextButtonHidden>
        <CreateGuildButton
          isDisabled={
            !guildName ||
            !!Object.values(errors).length ||
            (template === "GROWTH" && !touchedFields?.socialLinks?.TWITTER)
          }
        />
      </Pagination>
    </>
  )
}

export default BasicInfo
