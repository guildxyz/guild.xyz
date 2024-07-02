import { AddRewardPanelProps } from "rewards"
import DefaultAddRewardPanelWrapper from "../../DefaultAddRewardPanelWrapper"
import CreateNftForm from "./components/CreateNftForm"

const AddContractCallPanel = ({ onAdd }: AddRewardPanelProps) => (
  <DefaultAddRewardPanelWrapper>
    <CreateNftForm
      onSuccess={(reward) =>
        onAdd({
          guildPlatform: reward.guildPlatform,
          ...reward.rolePlatform,
          isNew: true,
        })
      }
    />
  </DefaultAddRewardPanelWrapper>
)

export default AddContractCallPanel
