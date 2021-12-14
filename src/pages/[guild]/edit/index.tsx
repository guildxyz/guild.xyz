import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Spinner,
  Stack,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import LogicPicker from "components/create-guild/LogicPicker"
import NameAndIcon from "components/create-guild/NameAndIcon"
import Requirements from "components/create-guild/Requirements"
import DeleteGuildCard from "components/[guild]/edit/index/DeleteGuildCard"
import useEdit from "components/[guild]/EditButtonGroup/components/CustomizationButton/hooks/useEdit"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { Check } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import tryToParse from "utils/tryToParse"

const GuildEditPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const router = useRouter()
  const { onSubmit, isLoading, isImageLoading } = useEdit()

  const guild = useGuild()

  const methods = useForm({
    mode: "all",
  })

  const { colorMode } = useColorMode()

  // Since we're fetching the data on mount, this is the "best" way to populate the form with default values.
  // https://github.com/react-hook-form/react-hook-form/issues/2492
  useEffect(() => {
    if (!methods || !guild) return
    const roleData = guild.platforms[0]?.roles?.[0]

    const { name, description, imageUrl } = guild
    const { logic, requirements } = roleData

    if (guild.platforms[0]?.roles?.length > 1) {
      methods.reset({
        name,
        description,
        imageUrl,
      })
      return
    }

    methods.reset({
      name,
      description,
      imageUrl,
      logic,
      requirements: requirements?.map((requirement) => ({
        active: true,
        type: requirement.type,
        chain: requirement.chain,
        address:
          requirement.type === "COIN"
            ? "0x0000000000000000000000000000000000000000"
            : requirement.address,
        key: requirement.key,
        value: tryToParse(requirement.value),
      })),
    })
  }, [methods, guild])

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <FormProvider {...methods}>
      <Layout
        title="Edit Guild"
        action={
          isOwner && (
            <HStack spacing={2}>
              <Button
                rounded="2xl"
                colorScheme="alpha"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <CtaButton
                isLoading={isLoading || isImageLoading}
                colorScheme="green"
                variant="solid"
                onClick={methods.handleSubmit(onSubmit)}
                leftIcon={<Icon as={Check} />}
              >
                Save
              </CtaButton>
            </HStack>
          )
        }
      >
        {isOwner ? (
          <VStack spacing={10} alignItems="start">
            <Section title="Choose a logo and name for your Guild">
              <NameAndIcon />
            </Section>

            <Section title="Guild description">
              <Description />
            </Section>

            {!(guild?.platforms?.[0].roles?.length > 1) && (
              <>
                <Section title="Requirements logic">
                  <LogicPicker />
                </Section>

                <Requirements />
              </>
            )}

            <Divider
              borderColor={colorMode === "light" ? "blackAlpha.400" : undefined}
            />

            <DeleteGuildCard />
          </VStack>
        ) : (
          <>
            {guild ? (
              <Alert status="error" mb="6" pb="5">
                <AlertIcon />
                <Stack>
                  <AlertDescription
                    position="relative"
                    top={1}
                    fontWeight="semibold"
                  >
                    Seems like you aren't the owner of this guild!
                  </AlertDescription>
                </Stack>
              </Alert>
            ) : (
              <Flex justifyContent="center">
                <Spinner mx="auto" size="lg" />
              </Flex>
            )}
          </>
        )}
      </Layout>
    </FormProvider>
  )
}

export default GuildEditPage
