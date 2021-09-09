import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react"
import PickGuildPlatform from "components/add-guild/PickGuildPlatform"
import RequirementFormCard from "components/add-guild/RequirementFormCard"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import JSConfetti from "js-confetti"
import { useEffect } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

const CreateGuildPage = (): JSX.Element => {
  const methods = useForm({ mode: "all" })

  const jsConfetti = new JSConfetti()

  useEffect(() => {
    // Pick TG by default as a platform
    methods.reset({
      guildPlatform: "TG",
    })
  }, [])

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: methods.control,
    name: "requirements",
  })
  const onSubmit = (data) => {
    jsConfetti.addConfetti({
      confettiColors: [
        "#6366F1",
        "#22c55e",
        "#ef4444",
        "#3b82f6",
        "#fbbf24",
        "#f472b6",
      ],
    })
    console.log(data)
  }

  /*
  Form structure:
  {
    name: string,
    requirements: [
      {
        holdType: "NFT" | "POAP" | "TOKEN"
        nft?: string
        poap?: string
        token?: string
        tokenQuantity?: number
      },
      ...
    ]
  }
  */

  const addRequirement = (holdType: "NFT" | "POAP" | "TOKEN") => {
    appendRequirement({ holdType })
  }

  return (
    <FormProvider {...methods}>
      <Layout
        title="Create Guild"
        action={
          <Button
            rounded="2xl"
            colorScheme="green"
            onClick={methods.handleSubmit(onSubmit)}
          >
            Summon
          </Button>
        }
      >
        <VStack spacing={8} alignItems="start">
          <Section title="Choose a Realm">
            <PickGuildPlatform />
          </Section>

          <Section title="Choose a name for your Guild">
            <FormControl isRequired isInvalid={methods.formState.errors.name}>
              <Input
                maxWidth="sm"
                {...methods.register("name", {
                  required: "This field is required.",
                })}
              />
              <FormErrorMessage>
                {methods.formState.errors.name?.message}
              </FormErrorMessage>
            </FormControl>
          </Section>

          {requirementFields.length && (
            <Section title="Requirements">
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={{ base: 5, md: 6 }}
              >
                {requirementFields.map((requirementForm, i) => (
                  <RequirementFormCard
                    key={requirementForm.id}
                    index={i}
                    field={requirementForm}
                    clickHandler={() => removeRequirement(i)}
                  />
                ))}
              </SimpleGrid>
            </Section>
          )}

          <Section title={requirementFields.length ? "Add more" : "Requirements"}>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 5, md: 6 }}
            >
              <AddCard
                text="Hold an NFT"
                clickHandler={() => addRequirement("NFT")}
              />
              <AddCard
                text="Hold a Token"
                clickHandler={() => addRequirement("TOKEN")}
              />
              <AddCard
                text="Hold a POAP"
                clickHandler={() => addRequirement("POAP")}
              />
            </SimpleGrid>
          </Section>
        </VStack>
      </Layout>
    </FormProvider>
  )
}

export default CreateGuildPage
