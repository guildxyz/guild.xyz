import { useFieldArray, useWatch } from "react-hook-form"
import { Visibility } from "types"
import CreateNftForm from "./components/CreateNftForm"

type Props = {
  onSuccess: () => void
}

const AddContractCallPanel = ({ onSuccess }: Props) => {
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })
  const roleVisibility: Visibility = useWatch({ name: ".visibility" })

  return (
    <CreateNftForm
      onSuccess={(guildPlatform) => {
        append({
          guildPlatform,
          isNew: true,
          visibility: roleVisibility,
        })
        onSuccess()
      }}
    />
  )
}

export default AddContractCallPanel
