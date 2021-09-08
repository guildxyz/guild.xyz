import { Button, FormControl, Input, SimpleGrid, VStack } from '@chakra-ui/react'
import AddCard from 'components/common/AddCard'
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import RuleCard from 'components/[guild]/RuleCard'
import { useState } from 'react'

const AddGuildPage = (): JSX.Element => {
  const [rules, setRules] = useState([])

  const addRule = () => {
    setRules([...rules, {}])
  }

  return (
    <Layout title="Add guild" action={<Button rounded="2xl" colorScheme="green">Summon</Button>}>
      <VStack spacing={4} alignItems="start">
        <Section title="Choose a name for your Guild">
          <FormControl>
            <Input maxWidth="sm" />
          </FormControl>
        </Section>

        {rules.length && (
          <Section title="Rules">
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={{ base: 5, md: 6 }}
            >
              {rules.map((rule, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <RuleCard key={i} title={`RULE#${i}_TITLE`} color="" />
              ))}
            </SimpleGrid>
          </Section>
        )}

        <Section title={rules.length ? "Rules" : "Stack more rules"}>
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={{ base: 5, md: 6 }}
        >
          <AddCard text="Hold an NFT" clickHandler={() => addRule()} />
          <AddCard text="Hold a Token" clickHandler={() => addRule()} />
          <AddCard text="Hold a POAP" clickHandler={() => addRule()} />
          </SimpleGrid>
        </Section>
      </VStack>
    </Layout>
  )
}

export default AddGuildPage
