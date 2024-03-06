import { AddPlatformPanelProps } from "platforms/platforms"
import CreateNftForm from "./components/CreateNftForm"

const AddContractCallPanel = ({ onSuccess }: AddPlatformPanelProps) => (
  <CreateNftForm
    onSuccess={(guildPlatform) =>
      onSuccess({
        guildPlatform,
        isNew: true,
      })
    }
  />
)

export default AddContractCallPanel
