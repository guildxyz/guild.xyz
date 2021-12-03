import { VStack } from "@chakra-ui/react"
import Section from "components/common/Section"
import LogicPicker from "components/create-role/LogicPicker"
import Requirements from "components/create-role/Requirements"
import Description from "components/create/Description"
import NameAndIcon from "components/create/NameAndIcon"

const EditRoleForm = (): JSX.Element => (
  <VStack spacing={10} alignItems="start">
    <Section title="Choose a logo and name for your Role">
      <NameAndIcon />
    </Section>

    <Section title="Role description">
      <Description />
    </Section>

    <Section title="Requirements logic">
      <LogicPicker />
    </Section>

    <Requirements />
  </VStack>
)

export default EditRoleForm
