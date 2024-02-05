import useForms from "components/[guild]/hooks/useForms"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const FormPreview = (): JSX.Element => {
  const formId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const { data, isLoading } = useForms()
  const form = data?.find((f) => f.id === formId)

  return <PlatformPreview type="FORM" isLoading={isLoading} name={form?.name} />
}

export default FormPreview
