import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useSubmitMachine from "components/create-guild/hooks/useSubmitMachine"
import NftFormCard from "components/create-guild/NftFormCard"
import PickGuildPlatform from "components/create-guild/PickGuildPlatform"
import PoapFormCard from "components/create-guild/PoapFormCard"
import TokenFormCard from "components/create-guild/TokenFormCard"
import { motion } from "framer-motion"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { RequirementType } from "temporaryData/types"

const CreateGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const triggerConfetti = useJsConfetti()
  const [tokensList, setTokensList] = useState(null)
  const [poapsList, setPoapsList] = useState(null)
  const { onSubmit } = useSubmitMachine()

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    // Fetch ERC-20 tokens from Coingecko
    if (!tokensList) {
      fetch("https://tokens.coingecko.com/uniswap/all.json")
        .then((rawData) => rawData.json())
        .then((data) => setTokensList(data.tokens))
        .catch(console.error)
    }

    // Fetch poaps too
    if (!poapsList) {
      fetch("https://api.poap.xyz/events")
        .then((rawData) => rawData.json())
        .then((data) => setPoapsList(data))
        .catch(console.error)
    }
  }, [])

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: methods.control,
    name: "requirements",
  })
  const onSubmitHandler = (data) => {
    onSubmit(data)
    triggerConfetti()
    // TODO...
    console.log(data)
  }

  const requirementsLength = useWatch({
    control: methods.control,
    name: "requirements",
  })?.length
  const [errorAnimation, setErrorAnimation] = useState<string | string[]>(
    "translateX(0px)"
  )

  const addRequirement = (type: RequirementType) => {
    appendRequirement({ type })
  }

  const newGuildName = useWatch({ control: methods.control, name: "name" })

  return (
    <FormProvider {...methods}>
      <Layout
        title={newGuildName || "Create Guild"}
        action={
          <Button
            disabled={!account || !requirementsLength}
            rounded="2xl"
            colorScheme="green"
            onClick={methods.handleSubmit(onSubmitHandler, () =>
              setErrorAnimation([
                "translateX(0px) translateY(0px)",
                "translateX(-25px) translateY(0)",
                "translateX(25px) translateY(20px)",
                "translateX(-25px) translateY(10px)",
                "translateX(25px) translateY(10px)",
                "translateX(-25px) translateY(20px)",
                "translateX(25px) translateY(0px)",
                "translateX(0px) translateY(0px)",
              ])
            )}
          >
            Summon
          </Button>
        }
      >
        {account ? (
          <motion.div
            onAnimationComplete={() => setErrorAnimation("translateX(0px)")}
            style={{
              position: "relative",
              transformOrigin: "bottom center",
              transform: "translateX(0px)",
            }}
            animate={{
              transform: errorAnimation,
            }}
            transition={{ duration: 0.4 }}
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
                <Section
                  title="Requirements"
                  description="Set up one or more requirements for your guild"
                >
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={{ base: 5, md: 6 }}
                  >
                    {requirementFields.map((requirementForm, i) => {
                      const type: RequirementType = methods.getValues(
                        `requirements.${i}.type`
                      )

                      if (type === "TOKEN") {
                        return (
                          <TokenFormCard
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            index={i}
                            tokensList={tokensList}
                            clickHandler={() => removeRequirement(i)}
                          />
                        )
                      }

                      if (type === "NFT") {
                        return (
                          <NftFormCard
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            index={i}
                            clickHandler={() => removeRequirement(i)}
                          />
                        )
                      }

                      if (type === "POAP") {
                        return (
                          <PoapFormCard
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            index={i}
                            poapsList={poapsList}
                            clickHandler={() => removeRequirement(i)}
                          />
                        )
                      }

                      return <></>
                    })}
                  </SimpleGrid>
                </Section>
              )}

              <Section
                title={requirementFields.length ? "Add more" : "Requirements"}
                description={
                  !requirementFields.length &&
                  "Set up one or more requirements for your guild"
                }
              >
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
          </motion.div>
        ) : (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1}>
                Please connect your wallet in order to continue!
              </AlertDescription>
            </Stack>
          </Alert>
        )}
      </Layout>
    </FormProvider>
  )
}

export default CreateGuildPage
