import { Button, FormControl, Input, SimpleGrid, VStack } from '@chakra-ui/react'
import AddCard from 'components/common/AddCard'
import Layout from "components/common/Layout"
import Section from "components/common/Section"

const AddGuildPage = (): JSX.Element => (
  <Layout title="Add guild" action={<Button rounded="2xl" colorScheme="green">Summon</Button>}>
    <VStack spacing={4} alignItems="start">
      <Section title="Choose a name for your Guild">
        <FormControl>
          <Input maxWidth="sm" />
        </FormControl>
      </Section>

      <Section title="Rules">
      <SimpleGrid 
        columns={{ base: 1, md: 2, lg: 3 }} 
        spacing={{ base: 5, md: 6 }}
      >
        <AddCard text="Hold an NFT" />
        <AddCard text="Hold a Token" />
        <AddCard text="Hold a POAP" />
        </SimpleGrid>
      </Section>
    </VStack>
  </Layout>
)

export default AddGuildPage
