import CreateNftForm from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import { useFieldArray, useFormContext } from "react-hook-form"

const CreateGuildContractCall = (): JSX.Element => {
  const { control } = useFormContext()
  const { setPlatform } = useCreateGuildContext()
  const { append } = useFieldArray({
    control,
    name: "guildPlatforms",
  })

  return (
    <CreateNftForm
      onSuccess={(newGuildPlatform) => {
        append({
          platformName: "NFT",
          platformGuildId: newGuildPlatform,
        })
        setPlatform("DEFAULT")
      }}
    />
  )
}

export default CreateGuildContractCall
