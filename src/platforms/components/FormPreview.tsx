import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const FormPreview = (): JSX.Element => {
  const formId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.formId",
  })
  const { form, isLoading } = useGuildForm(formId)

  return <PlatformPreview type="FORM" isLoading={isLoading} name={form?.name} />
}

export default FormPreview
