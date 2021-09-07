import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Input,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { Plus } from "phosphor-react"

const Links = (): JSX.Element => (
  <Section
    title="Links"
    description="Links to other platforms to show on your communitiy’s page"
    cardType
  >
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <GridItem>
        <FormControl id="github">
          <FormLabel>Github</FormLabel>
          <Input />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl id="medium">
          <FormLabel>Medium</FormLabel>
          <Input />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl id="twitter">
          <FormLabel>Twitter</FormLabel>
          <Input />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl id="reddit">
          <FormLabel>Reddit</FormLabel>
          <Input />
        </FormControl>
      </GridItem>
    </Grid>

    <Button mt={8} width="max-content" variant="ghost" leftIcon={<Icon as={Plus} />}>
      Add more
    </Button>
  </Section>
)

export default Links
