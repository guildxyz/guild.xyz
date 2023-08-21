import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import CreateNftForm from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm"
import { useFormContext } from "react-hook-form"

const CreateGuildContractCall = (): JSX.Element => {
  const { setValue } = useFormContext()
  const { nextStep } = useCreateGuildContext()

  return (
    <CreateNftForm
      onSuccess={(newGuildPlatform) => {
        setValue("guildPlatforms.0", newGuildPlatform)
        nextStep()
      }}
    />
  )
}

export default CreateGuildContractCall
