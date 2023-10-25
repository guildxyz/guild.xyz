import { ButtonGroup, Divider } from "@chakra-ui/react"
import AddRewardButton from "../AddRewardButton"
import AddRoleGroupMenu from "./components/AddRoleGroupMenu"

const AddRewardAndRoleGroup = () => (
  <ButtonGroup isAttached size="sm" variant="ghost">
    <AddRewardButton />
    <Divider orientation="vertical" h="8" />
    <AddRoleGroupMenu />
  </ButtonGroup>
)

export default AddRewardAndRoleGroup
