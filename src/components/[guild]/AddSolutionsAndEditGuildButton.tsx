import { MobileFooter } from "@/components/MobileFooter"
import { ButtonGroup, Divider } from "@chakra-ui/react"
import AddSolutionsButton from "solutions/components/AddSolutionsButton"
import EditGuildButton from "./EditGuild"

const AddSolutionsAndEditGuildButton = () => {
  return (
    <MobileFooter>
      <ButtonGroup
        isAttached
        w={{ base: "full", smd: "auto" }}
        size={{ base: "xl", smd: "md" }}
        variant={{ base: "ghost", smd: "solid" }}
        flexDir={{ base: "row-reverse", smd: "row" }}
      >
        <AddSolutionsButton
          w={{ base: "full", smd: "auto" }}
          borderRadius={{ base: "none", smd: "xl" }}
          fontSize="md !important"
        />
        <Divider orientation="vertical" h={{ base: 12, smd: 10 }} />
        <EditGuildButton borderRadius={{ base: "none", smd: "xl" }} />
      </ButtonGroup>
    </MobileFooter>
  )
}

export { AddSolutionsAndEditGuildButton }
