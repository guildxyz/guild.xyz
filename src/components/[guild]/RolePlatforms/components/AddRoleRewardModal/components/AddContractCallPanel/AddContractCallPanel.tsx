import { AddRewardPanelProps } from "platforms/rewards"
import CreateNftForm from "./components/CreateNftForm"

const AddContractCallPanel = ({ onAdd }: AddRewardPanelProps) => (
  <CreateNftForm
    onSuccess={(guildPlatform) =>
      onAdd({
        guildPlatform,
        isNew: true,
      })
    }
  />
)

export default AddContractCallPanel
