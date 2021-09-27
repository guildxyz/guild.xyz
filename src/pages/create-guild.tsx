import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import CtaButton from "components/common/CtaButton"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import useSubmitMachine from "components/create-guild/hooks/useSubmitMachine"
import IconSelector from "components/create-guild/IconSelector"
import LogicPicker from "components/create-guild/LogicPicker"
import NftFormCard from "components/create-guild/NftFormCard"
import PickGuildPlatform from "components/create-guild/PickGuildPlatform"
import PoapFormCard from "components/create-guild/PoapFormCard"
import SnapshotFormCard from "components/create-guild/SnapshotFormCard"
import TokenFormCard from "components/create-guild/TokenFormCard"
import { motion } from "framer-motion"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { RequirementType } from "temporaryData/types"
import slugify from "utils/slugify"

const CreateGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const { onSubmit, isLoading, isSuccess, state } = useSubmitMachine()
  const [errorAnimation, setErrorAnimation] = useState<string | string[]>(
    "translateX(0px)"
  )

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: methods.control,
    name: "requirements",
  })

  const onSubmitHandler = (data) => onSubmit(data)

  const onErrorHandler = () =>
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

  const requirementsLength = useWatch({
    control: methods.control,
    name: "requirements",
  })?.length

  const addRequirement = (type: RequirementType) => {
    appendRequirement({ type })
  }

  useEffect(() => {
    methods.register("urlName")
    methods.register("chainName", { value: "ETHEREUM" })
    methods.register("isGuild", { value: true })
  }, [])

  const guildName = useWatch({ control: methods.control, name: "name" })

  useEffect(() => {
    if (guildName) methods.setValue("urlName", slugify(guildName.toString()))
  }, [guildName])

  return (
    <FormProvider {...methods}>
      <Layout title="Create Guild">
        {account ? (
          <>
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
              <VStack spacing={10} alignItems="start">
                {/* <Stack direction={["column", "row"]} spacing="10" width="full"> */}
                <Section title="Choose a logo and name for your Guild">
                  <FormControl isRequired isInvalid={methods.formState.errors?.name}>
                    <InputGroup size="lg">
                      <InputLeftAddon p="0" overflow="hidden">
                        <IconSelector />
                      </InputLeftAddon>
                      <Input
                        maxWidth="sm"
                        {...methods.register("name", {
                          required: "This field is required.",
                          maxLength: {
                            value: 50,
                            message:
                              "The maximum possible name length is 50 characters",
                          },
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {methods.formState.errors?.name?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Section>

                <Section title="Choose a Realm">
                  <PickGuildPlatform />
                </Section>

                <Section title="Requirements logic">
                  <LogicPicker />
                </Section>

                {requirementFields.length && (
                  <Section
                    title="Set requirements"
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

                        switch (type) {
                          case "TOKEN":
                          case "ETHER":
                            return (
                              <TokenFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                          case "POAP":
                            return (
                              <PoapFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                          case "SNAPSHOT":
                            return (
                              <SnapshotFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                          default:
                            return (
                              <NftFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                        }
                      })}
                    </SimpleGrid>
                  </Section>
                )}

                <Section
                  title={requirementFields.length ? "Add more" : "Set requirements"}
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
                      onClick={() => addRequirement("NFT")}
                    />
                    <AddCard
                      text="Hold a Token"
                      onClick={() => addRequirement("TOKEN")}
                    />
                    <AddCard
                      text="Hold a POAP"
                      onClick={() => addRequirement("POAP")}
                    />
                    <AddCard
                      text="Snapshot strategy"
                      onClick={() => addRequirement("SNAPSHOT")}
                    />
                  </SimpleGrid>
                </Section>
              </VStack>
            </motion.div>
            <Flex justifyContent="right" mt="14">
              <CtaButton
                disabled={!account || !requirementsLength || isLoading || isSuccess}
                flexShrink={0}
                size="lg"
                isLoading={isLoading}
                loadingText={(() => {
                  switch (state.value) {
                    case "sign":
                      return "Signing"
                    case "fetchCommunity":
                      return "Saving data"
                    case "fetchLevels":
                      return "Saving requirements"
                    default:
                      return undefined
                  }
                })()}
                onClick={methods.handleSubmit(onSubmitHandler, onErrorHandler)}
              >
                {isSuccess ? "Success" : "Summon"}
              </CtaButton>
            </Flex>
          </>
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
