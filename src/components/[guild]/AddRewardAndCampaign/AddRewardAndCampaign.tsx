import { ButtonGroup, Divider } from "@chakra-ui/react"
import AddRewardButton from "../AddRewardButton"
import AddCampaignMenu from "./components/AddCampaignMenu"

const AddRewardAndCampaign = () => (
  <ButtonGroup isAttached size="sm" variant="ghost">
    <AddRewardButton />
    <Divider orientation="vertical" h="8" />
    <AddCampaignMenu />
  </ButtonGroup>
)

export default AddRewardAndCampaign
