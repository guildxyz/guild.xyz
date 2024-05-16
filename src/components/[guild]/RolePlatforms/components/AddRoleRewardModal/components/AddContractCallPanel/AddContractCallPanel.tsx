import { AddRewardPanelProps } from "platforms/rewards"
import DefaultAddRewardPanelWrapper from "../../DefaultAddRewardPanelWrapper"
import CreateNftForm from "./components/CreateNftForm"

const AddContractCallPanel = ({ onAdd }: AddRewardPanelProps) => (
  <DefaultAddRewardPanelWrapper>
    <CreateNftForm
      onSuccess={(guildPlatform) =>
        onAdd({
          guildPlatform,
          isNew: true,
        })
      }
    />
  </DefaultAddRewardPanelWrapper>
)

export default AddContractCallPanel
