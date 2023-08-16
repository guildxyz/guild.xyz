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

  /**
   * TODO (onSuccess):
   *
   * - Save the returned data from useCreateNft inside the form
   * - Then change the step inside useAddRewardContext to ROLES_REQUIREMENTS
   * - Note: we should maybe disable the back button if the user already deployed a
   *   contract?
   */

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
