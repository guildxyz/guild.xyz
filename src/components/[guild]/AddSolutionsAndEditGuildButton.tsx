import { MobileFooter } from "@/components/MobileFooter"
import { ButtonGroup, Divider } from "@chakra-ui/react"
import AddSolutionsButton from "solutions/components/AddSolutionsButton"
import EditGuildButton from "./EditGuild"

const AddSolutionsAndEditGuildButton = () => {
  return (
    <MobileFooter>
      <ButtonGroup isAttached>
        <AddSolutionsButton h={10} />
        <Divider orientation="vertical" h={10} />
        <EditGuildButton />
      </ButtonGroup>
    </MobileFooter>
  )
}

export { AddSolutionsAndEditGuildButton }
