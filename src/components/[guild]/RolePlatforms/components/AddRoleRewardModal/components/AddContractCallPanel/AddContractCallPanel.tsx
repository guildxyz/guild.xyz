import { AddRewardPanelProps } from "platforms/rewards"
import CreateNftForm from "./components/CreateNftForm"

const AddContractCallPanel = ({ onAdd }: AddRewardPanelProps) => (
  <CreateNftForm
    onSuccess={(reward) =>
      onAdd({
        guildPlatform: reward.guildPlatform,
        ...reward.rolePlatform,
        isNew: true,
      })
    }
  />
)

export default AddContractCallPanel
