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
import LogicPicker from "components/create-guild/LogicPicker"
import Requirements from "components/create-guild/Requirements"
import Description from "components/create/Description"
import NameAndIcon from "components/create/NameAndIcon"
import DeleteRoleCard from "components/[guild]/edit/[role]/DeleteRoleCard"
import useEditRole from "components/[guild]/edit/[role]/hooks/useEditRole"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { Check } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import tryToParse from "utils/tryToParse"

const RoleEditPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const router = useRouter()

  const { colorMode } = useColorMode()

  const guild = useGuild()
  const roleToEdit = useMemo(
    () =>
      guild?.roles?.find(
        (role) => role.roleId === parseInt(router.query.role?.toString())
      ),
    [guild]
  )

  const { onSubmit, isLoading, isImageLoading } = useEditRole(roleToEdit?.roleId)

  const methods = useForm({
    mode: "all",
  })

  // Since we're fetching the data on mount, this is the "best" way to populate the form with default values.
  // https://github.com/react-hook-form/react-hook-form/issues/2492
  useEffect(() => {
    if (!methods || !roleToEdit) return

    const { name, description, imageUrl, logic, requirements } = roleToEdit.role

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
  }, [methods, roleToEdit])

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <FormProvider {...methods}>
      <Layout
        title="Edit role"
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
            <Section title="Choose a logo and name for your role">
              <NameAndIcon />
            </Section>

            <Section title="Role description">
              <Description />
            </Section>

            <Section title="Requirements logic">
              <LogicPicker />
            </Section>

            <Requirements />

            <Divider
              borderColor={colorMode === "light" ? "blackAlpha.400" : undefined}
            />

            <DeleteRoleCard />
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
                    Seems like you aren't the owner of this role!
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

export default RoleEditPage
